import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

// Componente para proteger rutas que requieren autenticación
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Componente para rutas públicas (como auth) que redirigen si ya está autenticado
export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};
