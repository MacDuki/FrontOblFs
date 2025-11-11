import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  loginUser,
  logout,
  registerUser,
} from "../features/auth.slice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Inicialización de la aplicación (funcionalidad del AppInitializer)
  useEffect(() => {
    // Si hay un token guardado pero el estado no refleja autenticación,
    // esto puede pasar al recargar la página
    if (token && !isAuthenticated) {
      // Aquí podrías hacer una verificación del token con el servidor
      // Por ahora, confiamos en el token guardado en localStorage o sessionStorage
      
    }

    // Limpiar sessionStorage cuando la ventana se cierra (para "remember me" = false)
    const handleBeforeUnload = () => {
      // Solo limpiar si no hay token en localStorage (significa que era sessionStorage only)
      if (!localStorage.getItem("token") && sessionStorage.getItem("token")) {
        console.log("Clearing session-only token");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [token, isAuthenticated]);

  const login = (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const register = (userData) => {
    return dispatch(registerUser(userData));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout: logoutUser,
    clearError: clearAuthError,
  };
};
