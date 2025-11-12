import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth.jsx";
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
        <Route
          path="/"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Provider>
  );
}

export default App;
