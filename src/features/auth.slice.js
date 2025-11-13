import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

const getStoredToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

const parseBackendError = (error) => {
  const backendMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || "";
  
  const lowerMessage = backendMessage.toLowerCase();
  
  if (lowerMessage.includes("password") && 
      (lowerMessage.includes("pattern") || 
       lowerMessage.includes("required pattern") ||
       lowerMessage.includes("fails to match"))) {
    return "La contraseña debe contener al menos cinco letras y un número";
  }
  
  if (lowerMessage.includes("email") && 
      (lowerMessage.includes("already") || 
       lowerMessage.includes("exists") ||
       lowerMessage.includes("in use") ||
       lowerMessage.includes("duplicate"))) {
    return "Este correo electrónico ya está registrado. Por favor, usa otro o inicia sesión.";
  }
  
  if (lowerMessage.includes("username") && 
      (lowerMessage.includes("already") || 
       lowerMessage.includes("exists") ||
       lowerMessage.includes("taken") ||
       lowerMessage.includes("duplicate"))) {
    return "Este nombre de usuario ya está en uso. Por favor, elige otro.";
  }
  
  if (lowerMessage.includes("password") && 
      (lowerMessage.includes("short") || 
       lowerMessage.includes("min") ||
       lowerMessage.includes("length"))) {
    return "La contraseña debe tener al menos 6 caracteres";
  }
  
  if (lowerMessage.includes("email") && 
      (lowerMessage.includes("invalid") || 
       lowerMessage.includes("must be") ||
       lowerMessage.includes("valid"))) {
    return "Por favor, ingresa un correo electrónico válido";
  }
  
  if (lowerMessage.includes("username") && 
      (lowerMessage.includes("required") || 
       lowerMessage.includes("must not be empty"))) {
    return "El nombre de usuario es obligatorio";
  }
  
  if (lowerMessage.includes("passwords") && 
      (lowerMessage.includes("match") || 
       lowerMessage.includes("same"))) {
    return "Las contraseñas no coinciden";
  }
  
  if (lowerMessage.includes("invalid credentials") || 
      lowerMessage.includes("incorrect") ||
      lowerMessage.includes("wrong password")) {
    return "Usuario o contraseña incorrectos";
  }
  
  if (lowerMessage.includes("user not found") || 
      lowerMessage.includes("not found")) {
    return "No se encontró un usuario con ese nombre";
  }
  
  if (backendMessage && !lowerMessage.includes("fails to match") && 
      !lowerMessage.includes("with value")) {
    return backendMessage;
  }
  
  return "Ha ocurrido un error. Por favor, verifica los datos e intenta nuevamente.";
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const { token, user } = response.data;

      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      return { token, user, rememberMe };
    } catch (error) {
      const friendlyMessage = parseBackendError(error);
      return rejectWithValue(friendlyMessage);
    }
  }
);

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

      return { success: true };
    } catch (error) {
      const friendlyMessage = parseBackendError(error);
      return rejectWithValue(friendlyMessage);
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
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
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
