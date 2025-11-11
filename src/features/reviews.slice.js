import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

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

export const updateReview = createAsyncThunk(
  "reviews/update",
  async ({ id, score, comment }, { rejectWithValue }) => {
    try {
      console.log("📤 Enviando PATCH /reviews/" + id, { score, comment });
      const { data } = await api.patch(`/reviews/${id}`, { score, comment });
      console.log("✅ Respuesta del servidor:", data);
      
      const review = data?.review || data;
      return { id, ...review };
    } catch (err) {
      console.error("❌ [Reviews API] updateReview error:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      return rejectWithValue(
        err.response?.data?.message || "Error al actualizar reseña"
      );
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    byId: {},
    allIds: [],
    myReviewsIds: [],
    loading: false,
    error: null,
    lastSyncAt: 0,
  },
  reducers: {
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
    removeOptimistic(state, action) {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((x) => x !== id);
      state.myReviewsIds = state.myReviewsIds.filter((x) => x !== id);
    },
    updateOptimistic(state, action) {
      const { id, score, comment } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = {
          ...state.byId[id],
          score,
          comment,
          __prevScore: state.byId[id].score,
          __prevComment: state.byId[id].comment,
        };
      }
    },
    revertUpdate(state, action) {
      const { id } = action.payload;
      if (state.byId[id]) {
        if (state.byId[id].__prevScore !== undefined) {
          state.byId[id].score = state.byId[id].__prevScore;
          delete state.byId[id].__prevScore;
        }
        if (state.byId[id].__prevComment !== undefined) {
          state.byId[id].comment = state.byId[id].__prevComment;
          delete state.byId[id].__prevComment;
        }
      }
    },
    markSynced(state) {
      state.lastSyncAt = Date.now();
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createReview.fulfilled, (state, action) => {
        const real = action.payload;
        if (!real?._id) return;

        const tempId = Object.keys(state.byId).find(
          (id) =>
            id.startsWith("temp-") &&
            state.byId[id]?.__tempKey === real.__tempKey
        );

        if (tempId) {
          delete state.byId[tempId];
          state.allIds = state.allIds.filter((x) => x !== tempId);
          state.myReviewsIds = state.myReviewsIds.filter((x) => x !== tempId);
        }

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
      .addCase(deleteReview.fulfilled, (state, action) => {
        const reviewId = action.payload;
        delete state.byId[reviewId];
        state.allIds = state.allIds.filter(id => id !== reviewId);
        state.myReviewsIds = state.myReviewsIds.filter(id => id !== reviewId);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated?.id && state.byId[updated.id]) {
          state.byId[updated.id] = {
            ...state.byId[updated.id],
            ...updated,
            _id: updated.id,
          };
          delete state.byId[updated.id].__prevScore;
          delete state.byId[updated.id].__prevComment;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { createOptimistic, removeOptimistic, updateOptimistic, revertUpdate, markSynced, clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;

export const selectReviewsState = (s) => s.reviews;
export const selectAllReviews = (s) =>
  s.reviews.allIds.map((id) => s.reviews.byId[id]).filter(Boolean);
export const selectMyReviews = (s) =>
  s.reviews.myReviewsIds.map((id) => s.reviews.byId[id]).filter(Boolean);
export const selectReviewsLoading = (s) => s.reviews.loading;
export const selectReviewsError = (s) => s.reviews.error;
