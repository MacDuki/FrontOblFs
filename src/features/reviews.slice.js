import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

// ---------- Thunks ----------
export const fetchAllReviews = createAsyncThunk(
  "reviews/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/reviews");
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("❌ [Reviews API] fetchAllReviews error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Error al obtener reseñas"
      );
    }
  }
);

export const fetchMyReviews = createAsyncThunk(
  "reviews/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/reviews/my-reviews");
      
      // El backend puede devolver { reviews: [...] } o directamente [...]
      const reviewsArray = Array.isArray(data) ? data : (data.reviews || []);
      
      return reviewsArray;
    } catch (err) {
      console.error("❌ [Reviews API] fetchMyReviews error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Error al obtener mis reseñas"
      );
    }
  }
);

export const createReview = createAsyncThunk(
  "reviews/create",
  async (reviewData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/reviews", reviewData);
      
      // El backend puede devolver { review: {...} } o directamente {...}
      const review = data?.review || data;
      
      return review;
    } catch (err) {
      console.error("❌ [Reviews API] createReview error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Error al crear reseña"
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/delete",
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error al eliminar reseña"
      );
    }
  }
);

// ---------- Slice ----------
const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    byId: {}, // _id -> review
    allIds: [], // orden estable
    myReviewsIds: [], // IDs de mis reseñas
    loading: false,
    error: null,
    lastSyncAt: 0,
  },
  reducers: {
    // Optimista: crear placeholder antes de POST
    createOptimistic(state, action) {
      const tempReview = action.payload;
      state.byId[tempReview._id] = tempReview;
      if (!state.allIds.includes(tempReview._id)) {
        state.allIds.unshift(tempReview._id);
      }
      if (!state.myReviewsIds.includes(tempReview._id)) {
        state.myReviewsIds.unshift(tempReview._id);
      }
    },
    // Revertir placeholder si falla
    removeOptimistic(state, action) {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((x) => x !== id);
      state.myReviewsIds = state.myReviewsIds.filter((x) => x !== id);
    },
    markSynced(state) {
      state.lastSyncAt = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.byId = {};
        state.allIds = [];
        for (const r of action.payload) {
          state.byId[r._id] = r;
          state.allIds.push(r._id);
        }
        state.lastSyncAt = Date.now();
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // fetch my reviews
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.myReviewsIds = [];
        for (const r of action.payload) {
          state.byId[r._id] = r;
          state.myReviewsIds.push(r._id);
          if (!state.allIds.includes(r._id)) {
            state.allIds.push(r._id);
          }
        }
        state.lastSyncAt = Date.now();
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // create
      .addCase(createReview.fulfilled, (state, action) => {
        const real = action.payload;
        if (!real?._id) return;

        // Buscar y eliminar el placeholder temporal
        const tempId = Object.keys(state.byId).find(
          (id) =>
            id.startsWith("temp-") &&
            state.byId[id]?.__tempKey === real.__tempKey
        );

        // Eliminar el placeholder si se encontró
        if (tempId) {
          delete state.byId[tempId];
          state.allIds = state.allIds.filter((x) => x !== tempId);
          state.myReviewsIds = state.myReviewsIds.filter((x) => x !== tempId);
        }

        // Agregar la review real
        state.byId[real._id] = real;
        if (!state.allIds.includes(real._id)) {
          state.allIds.unshift(real._id);
        }
        if (!state.myReviewsIds.includes(real._id)) {
          state.myReviewsIds.unshift(real._id);
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      // delete
      .addCase(deleteReview.fulfilled, (state, action) => {
        const reviewId = action.payload;
        // Eliminar del objeto byId
        delete state.byId[reviewId];
        // Eliminar de allIds
        state.allIds = state.allIds.filter(id => id !== reviewId);
        // Eliminar de myReviewsIds
        state.myReviewsIds = state.myReviewsIds.filter(id => id !== reviewId);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { createOptimistic, removeOptimistic, markSynced } = reviewsSlice.actions;
export default reviewsSlice.reducer;

// ---------- Selectores ----------
export const selectReviewsState = (s) => s.reviews;
export const selectAllReviews = (s) =>
  s.reviews.allIds.map((id) => s.reviews.byId[id]).filter(Boolean);
export const selectMyReviews = (s) =>
  s.reviews.myReviewsIds.map((id) => s.reviews.byId[id]).filter(Boolean);
export const selectReviewsLoading = (s) => s.reviews.loading;
export const selectReviewsError = (s) => s.reviews.error;
