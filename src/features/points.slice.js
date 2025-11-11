import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

// Thunk para obtener el resumen de puntos totales
export const getPointsSummary = createAsyncThunk(
  "points/getPointsSummary",
  async (_, { rejectWithValue }) => {
    try {
      console.log(
        "💰 [Points API] getPointsSummary - Fetching points summary..."
      );
      const response = await api.get("/points/my/summary");
      console.log("✅ [Points API] getPointsSummary - Success:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [Points API] getPointsSummary - Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener el resumen de puntos"
      );
    }
  }
);

// Thunk para obtener puntos por fecha
export const getPointsByDate = createAsyncThunk(
  "points/getPointsByDate",
  async ({ from, to }, { rejectWithValue }) => {
    try {
      console.log(
        `📅 [Points API] getPointsByDate - Fetching points from ${from} to ${to}...`
      );
      const response = await api.get(`/points/my`, {
        params: { from, to },
      });
      console.log("✅ [Points API] getPointsByDate - Success:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [Points API] getPointsByDate - Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los puntos por fecha"
      );
    }
  }
);

const pointsSlice = createSlice({
  name: "points",
  initialState: {
    summary: null,
    pointsByDate: [],
    isLoadingSummary: false,
    isLoadingPointsByDate: false,
    summaryError: null,
    pointsByDateError: null,
    lastSummaryUpdate: null,
    lastPointsByDateUpdate: null,
  },
  reducers: {
    clearPointsData: (state) => {
      state.summary = null;
      state.pointsByDate = [];
      state.summaryError = null;
      state.pointsByDateError = null;
      state.lastSummaryUpdate = null;
      state.lastPointsByDateUpdate = null;
    },
    clearSummaryError: (state) => {
      state.summaryError = null;
    },
    clearPointsByDateError: (state) => {
      state.pointsByDateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Points Summary
      .addCase(getPointsSummary.pending, (state) => {
        state.isLoadingSummary = true;
        state.summaryError = null;
      })
      .addCase(getPointsSummary.fulfilled, (state, action) => {
        state.isLoadingSummary = false;
        state.summary = action.payload;
        state.summaryError = null;
        state.lastSummaryUpdate = new Date().toISOString();
      })
      .addCase(getPointsSummary.rejected, (state, action) => {
        state.isLoadingSummary = false;
        state.summaryError = action.payload;
      })
      // Get Points By Date
      .addCase(getPointsByDate.pending, (state) => {
        state.isLoadingPointsByDate = true;
        state.pointsByDateError = null;
      })
      .addCase(getPointsByDate.fulfilled, (state, action) => {
        state.isLoadingPointsByDate = false;
        state.pointsByDate = action.payload;
        state.pointsByDateError = null;
        state.lastPointsByDateUpdate = new Date().toISOString();
      })
      .addCase(getPointsByDate.rejected, (state, action) => {
        state.isLoadingPointsByDate = false;
        state.pointsByDateError = action.payload;
      });
  },
});

export const { clearPointsData, clearSummaryError, clearPointsByDateError } =
  pointsSlice.actions;
export default pointsSlice.reducer;
