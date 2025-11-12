import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";
import { logout } from "./auth.slice";

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
        // Normalizar payload para garantizar shape consistente { date: YYYY-MM-DD, quantity: number }
        const toLocalYMD = (d) => {
          try {
            const dt = new Date(d);
            if (isNaN(dt.getTime())) return null;
            const y = dt.getFullYear();
            const m = String(dt.getMonth() + 1).padStart(2, "0");
            const day = String(dt.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
          } catch {
            return null;
          }
        };

        const normalize = (item) => {
          // Detectar posibles nombres de campos
          const rawDate =
            item?.date ??
            item?.createdAt ??
            item?.day ??
            item?.timestamp ??
            null;
          const rawQty =
            item?.quantity ?? item?.points ?? item?.value ?? item?.qty ?? 0;

          // Si la fecha ya viene como YYYY-MM-DD usarla; si no, convertir a local YYYY-MM-DD
          let dateStr = null;
          if (
            typeof rawDate === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
          ) {
            dateStr = rawDate;
          } else if (rawDate) {
            dateStr = toLocalYMD(rawDate);
          }

          return {
            date:
              dateStr ||
              (typeof rawDate === "string"
                ? rawDate
                : new Date().toISOString().split("T")[0]),
            quantity: Number(rawQty) || 0,
          };
        };

        const payload = Array.isArray(action.payload) ? action.payload : [];
        state.pointsByDate = payload.map(normalize);
        state.pointsByDateError = null;
        state.lastPointsByDateUpdate = new Date().toISOString();
      })
      .addCase(getPointsByDate.rejected, (state, action) => {
        state.isLoadingPointsByDate = false;
        state.pointsByDateError = action.payload;
      })
      // Escuchar el logout de auth para limpiar el estado
      .addCase(logout, (state) => {
        state.summary = null;
        state.pointsByDate = [];
        state.summaryError = null;
        state.pointsByDateError = null;
        state.lastSummaryUpdate = null;
        state.lastPointsByDateUpdate = null;
      });
  },
});

export const { clearPointsData, clearSummaryError, clearPointsByDateError } =
  pointsSlice.actions;
export default pointsSlice.reducer;
