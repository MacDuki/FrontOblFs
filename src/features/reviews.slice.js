import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

// ---------- Thunks ----------
export const fetchAllReviews = createAsyncThunk(
  "reviews/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/reviews");
      console.log("⭐ [Reviews API] fetchAllReviews response:", data);
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
      const response = await api.get("/reviews/my-reviews");
      console.log("⭐ [Reviews API] fetchMyReviews FULL response:", response);
      console.log("⭐ [Reviews API] fetchMyReviews data:", response.data);
      
      const data = response.data;
      
      // El backend puede devolver { reviews: [...] } o directamente [...]
      const reviewsArray = Array.isArray(data) ? data : (data.reviews || []);
      console.log("⭐ [Reviews API] Processed reviews array:", reviewsArray);
      
      return reviewsArray;
    } catch (err) {
      console.error("❌ [Reviews API] fetchMyReviews error:", err);
      console.error("❌ [Reviews API] Error response:", err.response);
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
      console.log("⭐ [Reviews API] createReview response:", data);
      return data;
    } catch (err) {
      console.error("❌ [Reviews API] createReview error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Error al crear reseña"
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
        const review = action.payload;
        if (review?._id) {
          state.byId[review._id] = review;
          if (!state.allIds.includes(review._id)) {
            state.allIds.unshift(review._id);
          }
          if (!state.myReviewsIds.includes(review._id)) {
            state.myReviewsIds.unshift(review._id);
          }
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { markSynced } = reviewsSlice.actions;
export default reviewsSlice.reducer;

// ---------- Selectores ----------
export const selectReviewsState = (s) => s.reviews;
export const selectAllReviews = (s) =>
  s.reviews.allIds.map((id) => s.reviews.byId[id]);
export const selectMyReviews = (s) =>
  s.reviews.myReviewsIds.map((id) => s.reviews.byId[id]);
export const selectReviewsLoading = (s) => s.reviews.loading;
export const selectReviewsError = (s) => s.reviews.error;
