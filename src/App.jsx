import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth.jsx";
import DiscoverBooks from "./components/Books/DiscoverBooks/DiscoverBooks.jsx";
import Home from "./components/Home/Home.jsx";
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
        <Route
          path="/discover-books"
          element={
            <ProtectedRoute>
              <DiscoverBooks />
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
