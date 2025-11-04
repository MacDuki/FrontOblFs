import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

// --------- Constantes ----------
export const ESTADOS_LIBRO = {
  NONE: "NONE",
  LEYENDO: "LEYENDO",
  TERMINADO: "TERMINADO",
};

// --------- Thunks (API) ----------
export const fetchLibraryItemsByUser = createAsyncThunk(
  "libraryItems/fetchByUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/library-items/user");
      console.log("📚 [LibraryItem API] fetchByUser response:", data);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("❌ [LibraryItem API] fetchByUser error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Error al cargar biblioteca"
      );
    }
  }
);

export const fetchLibraryItemsByCollection = createAsyncThunk(
  "libraryItems/fetchByCollection",
  async (collectionId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/library-items/getFromcollections/${collectionId}/items`
      );
      console.log(
        `📚 [LibraryItem API] fetchByCollection (${collectionId}) response:`,
        data
      );
      return { collectionId, items: Array.isArray(data) ? data : [] };
    } catch (err) {
      console.error(
        `❌ [LibraryItem API] fetchByCollection (${collectionId}) error:`,
        err
      );
      return rejectWithValue(
        err.response?.data?.message || "Error al cargar por colección"
      );
    }
  }
);

export const fetchLibraryItemById = createAsyncThunk(
  "libraryItems/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/library-items/${id}`);
      console.log(`📚 [LibraryItem API] fetchById (${id}) response:`, data);
      return data;
    } catch (err) {
      console.error(`❌ [LibraryItem API] fetchById (${id}) error:`, err);
      return rejectWithValue(
        err.response?.data?.message || "Error al obtener el libro"
      );
    }
  }
);

export const addLibraryItem = createAsyncThunk(
  "libraryItems/add",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/library-items/add", payload);
      console.log("📚 [LibraryItem API] addLibraryItem response:", data);
      return data;
    } catch (err) {
      console.error("❌ [LibraryItem API] addLibraryItem error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Error al agregar libro"
      );
    }
  }
);

export const deleteLibraryItem = createAsyncThunk(
  "libraryItems/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/library-items/${id}`);
      console.log(
        `📚 [LibraryItem API] deleteLibraryItem (${id}) response:`,
        response.data
      );
      return { id };
    } catch (err) {
      console.error(
        `❌ [LibraryItem API] deleteLibraryItem (${id}) error:`,
        err
      );
      return rejectWithValue(
        err.response?.data?.message || "Error al eliminar libro"
      );
    }
  }
);

export const addPagesToLibraryItem = createAsyncThunk(
  "libraryItems/addPages",
  async ({ id, pages }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/library-items/${id}/add-pages`, {
        pages,
      });
      console.log(
        `📚 [LibraryItem API] addPages (${id}, +${pages}) response:`,
        data
      );
      return data; // espera objeto actualizado
    } catch (err) {
      console.error(
        `❌ [LibraryItem API] addPages (${id}, +${pages}) error:`,
        err
      );
      return rejectWithValue(
        err.response?.data?.message || "Error al sumar páginas"
      );
    }
  }
);

export const changeEstadoLibraryItem = createAsyncThunk(
  "libraryItems/changeEstado",
  async ({ id, estado }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/library-items/${id}/estado`, {
        estado,
      });
      console.log(
        `📚 [LibraryItem API] changeEstado (${id}, ${estado}) response:`,
        data
      );
      return data; // espera objeto actualizado
    } catch (err) {
      console.error(
        `❌ [LibraryItem API] changeEstado (${id}, ${estado}) error:`,
        err
      );
      return rejectWithValue(
        err.response?.data?.message || "Error al cambiar estado"
      );
    }
  }
);

// --------- Slice ----------
const initialState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  lastSyncAt: 0,
};

const slice = createSlice({
  name: "libraryItems",
  initialState,
  reducers: {
    // ---- Optimistas ----
    addOptimistic(state, action) {
      const item = action.payload;
      state.byId[item._id] = item;
      if (!state.allIds.includes(item._id)) state.allIds.unshift(item._id);
    },
    removeOptimistic(state, action) {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((x) => x !== id);
    },
    addPagesOptimistic(state, action) {
      const { id, pages } = action.payload;
      const it = state.byId[id];
      if (!it) return;
      const pageCount = it.pageCount ?? Infinity;
      const nuevo = Math.max(
        0,
        Math.min((it.progreso ?? 0) + pages, pageCount)
      );
      state.byId[id] = {
        ...it,
        progreso: nuevo,
        __prevProgreso: it.progreso ?? 0,
      };
    },
    revertPages(state, action) {
      const { id } = action.payload;
      const it = state.byId[id];
      if (it && it.__prevProgreso != null) {
        it.progreso = it.__prevProgreso;
        delete it.__prevProgreso;
      }
    },
    changeEstadoOptimistic(state, action) {
      const { id, estado } = action.payload;
      const it = state.byId[id];
      if (!it) return;
      state.byId[id] = { ...it, estado, __prevEstado: it.estado };
    },
    revertEstado(state, action) {
      const { id } = action.payload;
      const it = state.byId[id];
      if (it && it.__prevEstado != null) {
        it.estado = it.__prevEstado;
        delete it.__prevEstado;
      }
    },
    markSynced(state) {
      state.lastSyncAt = Date.now();
    },
  },
  extraReducers: (b) => {
    b
      // fetch user
      .addCase(fetchLibraryItemsByUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchLibraryItemsByUser.fulfilled, (s, a) => {
        s.loading = false;
        s.error = null;
        s.byId = {};
        s.allIds = [];
        for (const it of a.payload) {
          s.byId[it._id] = it;
          s.allIds.push(it._id);
        }
        s.lastSyncAt = Date.now();
      })
      .addCase(fetchLibraryItemsByUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      })
      // fetch by collection
      .addCase(fetchLibraryItemsByCollection.fulfilled, (s, a) => {
        for (const it of a.payload.items) {
          s.byId[it._id] = it;
          if (!s.allIds.includes(it._id)) s.allIds.push(it._id);
        }
      })
      // fetch by id
      .addCase(fetchLibraryItemById.fulfilled, (s, a) => {
        const it = a.payload;
        if (!it?._id) return;
        s.byId[it._id] = it;
        if (!s.allIds.includes(it._id)) s.allIds.unshift(it._id);
      })
      // add
      .addCase(addLibraryItem.fulfilled, (s, a) => {
        const real = a.payload;
        if (!real?._id) return;
        // reemplazo de temp si coincide __tempKey
        const tempId = Object.keys(s.byId).find(
          (id) => s.byId[id]?.__tempKey === real.__tempKey
        );
        if (tempId) {
          const wasFirst = s.allIds[0] === tempId;
          delete s.byId[tempId];
          s.allIds = s.allIds.filter((x) => x !== tempId);
          s.byId[real._id] = real;
          if (wasFirst) s.allIds.unshift(real._id);
          else s.allIds.push(real._id);
        } else {
          s.byId[real._id] = real;
          if (!s.allIds.includes(real._id)) s.allIds.unshift(real._id);
        }
      })
      .addCase(addLibraryItem.rejected, (s, a) => {
        s.error = a.payload || a.error.message;
      })
      // delete
      .addCase(deleteLibraryItem.fulfilled, (s, a) => {
        const { id } = a.payload || {};
        if (!id) return;
        delete s.byId[id];
        s.allIds = s.allIds.filter((x) => x !== id);
      })
      .addCase(deleteLibraryItem.rejected, (s, a) => {
        s.error = a.payload || a.error.message;
      })
      // add pages
      .addCase(addPagesToLibraryItem.fulfilled, (s, a) => {
        const it = a.payload;
        if (!it?._id) return;
        s.byId[it._id] = { ...s.byId[it._id], ...it };
        delete s.byId[it._id].__prevProgreso;
      })
      .addCase(addPagesToLibraryItem.rejected, (s, a) => {
        s.error = a.payload || a.error.message;
      })
      // change estado
      .addCase(changeEstadoLibraryItem.fulfilled, (s, a) => {
        const it = a.payload;
        if (!it?._id) return;
        s.byId[it._id] = { ...s.byId[it._id], ...it };
        delete s.byId[it._id].__prevEstado;
      })
      .addCase(changeEstadoLibraryItem.rejected, (s, a) => {
        s.error = a.payload || a.error.message;
      });
  },
});

export default slice.reducer;
export const {
  addOptimistic,
  removeOptimistic,
  addPagesOptimistic,
  revertPages,
  changeEstadoOptimistic,
  revertEstado,
  markSynced,
} = slice.actions;

// --------- Selectores ----------
export const selectLibraryState = (s) => s.libraryItems;
export const selectAllLibraryItems = (s) =>
  s.libraryItems.allIds.map((id) => s.libraryItems.byId[id]);
export const selectLibraryLoading = (s) => s.libraryItems.loading;
export const selectLibraryError = (s) => s.libraryItems.error;

export const makeSelectByCollection = (collectionId) => (s) =>
  selectAllLibraryItems(s).filter((it) => it.collectionId === collectionId);

export const selectById = (id) => (s) => s.libraryItems.byId[id] || null;
