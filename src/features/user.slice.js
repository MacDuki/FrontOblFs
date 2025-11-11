import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";
import { logout } from "./auth.slice";

// Thunk para obtener el perfil del usuario
export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      console.log("👤 [User API] getProfile - Fetching user profile...");
      const response = await api.get("/user/me");
      console.log("✅ [User API] getProfile - Success:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [User API] getProfile - Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener el perfil"
      );
    }
  }
);

// Thunk para obtener el nivel del usuario
export const getLevel = createAsyncThunk(
  "user/getLevel",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📊 [User API] getLevel - Fetching user level...");
      const response = await api.get("/user/getMyLevel");
      console.log("✅ [User API] getLevel - Success:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [User API] getLevel - Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener el nivel"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    level: null,
    isLoadingProfile: false,
    isLoadingLevel: false,
    profileError: null,
    levelError: null,
    lastProfileUpdate: null,
    lastLevelUpdate: null,
  },
  reducers: {
    clearUserData: (state) => {
      state.profile = null;
      state.level = null;
      state.profileError = null;
      state.levelError = null;
      state.lastProfileUpdate = null;
      state.lastLevelUpdate = null;
    },
    clearProfileError: (state) => {
      state.profileError = null;
    },
    clearLevelError: (state) => {
      state.levelError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoadingProfile = true;
        state.profileError = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoadingProfile = false;
        state.profile = action.payload;
        state.profileError = null;
        state.lastProfileUpdate = new Date().toISOString();
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoadingProfile = false;
        state.profileError = action.payload;
      })
      // Get Level
      .addCase(getLevel.pending, (state) => {
        state.isLoadingLevel = true;
        state.levelError = null;
      })
      .addCase(getLevel.fulfilled, (state, action) => {
        state.isLoadingLevel = false;
        state.level = action.payload;
        state.levelError = null;
        state.lastLevelUpdate = new Date().toISOString();
      })
      .addCase(getLevel.rejected, (state, action) => {
        state.isLoadingLevel = false;
        state.levelError = action.payload;
      })
      // Escuchar el logout de auth para limpiar el estado
      .addCase(logout, (state) => {
        state.profile = null;
        state.level = null;
        state.profileError = null;
        state.levelError = null;
        state.lastProfileUpdate = null;
        state.lastLevelUpdate = null;
      });
  },
});

export const { clearUserData, clearProfileError, clearLevelError } =
  userSlice.actions;
export default userSlice.reducer;
