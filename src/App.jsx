import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth.jsx";
import DiscoverBooks from "./components/Books/DiscoverBooks/DiscoverBooks.jsx";
import Home from "./components/Home/Home.jsx";
import { store } from "./store/store.js";
function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/discover-books" element={<DiscoverBooks />} />
      </Routes>
    </Provider>
  );
}

export default App;
