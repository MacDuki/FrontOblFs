import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth.jsx";
import Home from "./components/Home/Home.jsx";
import MyReviewsPage from "./components/Home/MyReviewsPage.jsx";
import { NotFound } from "./components/NotFound/NotFound.jsx";
import {
  ProtectedRoute,
  PublicRoute,
} from "./components/Utils/ProtectedRoute.jsx";
import { store } from "./store/store.js";
function App() {
  return (
    <Provider store={store}>
      <Routes>
        {/* Ruta pública - SOLO accesible si NO está autenticado */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas - solo accesibles si está autenticado */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* DiscoverBooks ya no es página separada; se integra en Home (DesktopLayout) */}
        <Route
          path="/my-reviews"
          element={
            <ProtectedRoute>
              <MyReviewsPage />
            </ProtectedRoute>
          }
        />

        {/* Ruta catch-all - maneja páginas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Provider>
  );
}

export default App;
