import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

// Helper para obtener token de localStorage o sessionStorage
const getStoredToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Thunk para login
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const { token, user } = response.data;
      console.log("🔐 [Auth API] loginUser response:", {
        user,
        token: token ? "***" : null,
      });

      // Guardar token según la opción "remember me"
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        // Usar sessionStorage para sesión temporal
        sessionStorage.setItem("token", token);
      }

      return { token, user, rememberMe };
    } catch (error) {
      console.error("❌ [Auth API] loginUser error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error en el login"
      );
    }
  }
);

// Thunk para register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { username, email, password, repeat_password },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
        repeat_password,
      });
      console.log("🔐 [Auth API] registerUser response:", response.data);

      // El registro solo retorna éxito, no hace login automático
      return { success: true };
    } catch (error) {
      console.error("❌ [Auth API] registerUser error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error en el registro"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: getStoredToken(),
    isLoading: false,
    error: null,
    isAuthenticated: !!getStoredToken(),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Limpiar ambos storages
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      
      // Limpiar foto de perfil
      localStorage.removeItem("profilePicture");

      // IMPORTANTE: Este reducer también será escuchado por otros slices
      // para resetear su estado cuando el usuario cierre sesión
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // No se actualiza el estado de autenticación aquí
        // El login automático se maneja por separado
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
