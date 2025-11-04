import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

// ---------- Thunks ----------
export const fetchCollections = createAsyncThunk(
  "collections/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/collections");
      console.log("📚 [Collections API] fetchCollections response:", data);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("❌ [Collections API] fetchCollections error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Error al obtener colecciones"
      );
    }
  }
);

export const createCollection = createAsyncThunk(
  "collections/create",
  async ({ name }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/collections", { name });
      console.log("📚 [Collections API] createCollection response:", data);
      return data;
    } catch (err) {
      console.error("❌ [Collections API] createCollection error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Error al crear colección"
      );
    }
  }
);

export const renameCollection = createAsyncThunk(
  "collections/rename",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/collections/${id}`, { name });
      console.log(
        `📚 [Collections API] renameCollection (${id}) response:`,
        data
      );
      return data;
    } catch (err) {
      console.error(
        `❌ [Collections API] renameCollection (${id}) error:`,
        err
      );
      return rejectWithValue(
        err.response?.data?.message || "Error al renombrar colección"
      );
    }
  }
);

export const deleteCollection = createAsyncThunk(
  "collections/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/collections/${id}`);
      console.log(
        `📚 [Collections API] deleteCollection (${id}) response:`,
        response.data
      );
      return { id };
    } catch (err) {
      console.error(
        `❌ [Collections API] deleteCollection (${id}) error:`,
        err
      );
      return rejectWithValue(
        err.response?.data?.message || "Error al eliminar colección"
      );
    }
  }
);

// ---------- Slice ----------
const collectionsSlice = createSlice({
  name: "collections",
  initialState: {
    byId: {}, // _id -> collection
    allIds: [], // orden estable
    loading: false,
    error: null,
    lastSyncAt: 0, // control de refrescos
  },
  reducers: {
    // Optimista: crear placeholder antes de POST
    createOptimistic(state, action) {
      const tempId = action.payload._id;
      state.byId[tempId] = action.payload;
      if (!state.allIds.includes(tempId)) state.allIds.unshift(tempId);
    },
    // Revertir placeholder si falla
    removeOptimistic(state, action) {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((x) => x !== id);
    },
    // Optimista: rename local
    renameOptimistic(state, action) {
      const { id, name, prevName } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], name, __prevName: prevName };
      }
    },
    // Revertir rename si falla
    revertRename(state, action) {
      const { id } = action.payload;
      if (state.byId[id]?.__prevName != null) {
        state.byId[id].name = state.byId[id].__prevName;
        delete state.byId[id].__prevName;
      }
    },
    // Marca de sincronización para control de polling
    markSynced(state) {
      state.lastSyncAt = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.byId = {};
        state.allIds = [];
        for (const c of action.payload) {
          state.byId[c._id] = c;
          state.allIds.push(c._id);
        }
        state.lastSyncAt = Date.now();
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // create
      .addCase(createCollection.fulfilled, (state, action) => {
        const real = action.payload;
        // Si se creó con placeholder, reemplazar id temporal
        const tempId = Object.keys(state.byId).find(
          (k) => state.byId[k]?.__tempKey === real?.__tempKey
        );
        if (tempId && real?._id) {
          // mover datos al id real
          const wasFirst = state.allIds[0] === tempId;
          delete state.byId[tempId];
          state.byId[real._id] = { ...real };
          state.allIds = state.allIds.filter((x) => x !== tempId).concat([]);
          if (wasFirst) state.allIds.unshift(real._id);
          else state.allIds.push(real._id);
        } else if (real?._id) {
          state.byId[real._id] = real;
          if (!state.allIds.includes(real._id)) state.allIds.unshift(real._id);
        }
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      // rename
      .addCase(renameCollection.fulfilled, (state, action) => {
        const c = action.payload;
        if (c && c._id && state.byId[c._id]) {
          state.byId[c._id] = { ...state.byId[c._id], ...c };
          delete state.byId[c._id].__prevName;
        }
      })
      .addCase(renameCollection.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      // delete
      .addCase(deleteCollection.fulfilled, (state, action) => {
        const { id } = action.payload || {};
        if (!id) return;
        delete state.byId[id];
        state.allIds = state.allIds.filter((x) => x !== id);
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  createOptimistic,
  removeOptimistic,
  renameOptimistic,
  revertRename,
  markSynced,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;

// ---------- Selectores ----------
export const selectCollectionsState = (s) => s.collections;
export const selectAllCollections = (s) =>
  selectCollectionsState(s).allIds.map((id) => s.collections.byId[id]);
export const selectCollectionsLoading = (s) => s.collections.loading;
export const selectCollectionsError = (s) => s.collections.error;
