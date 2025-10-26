import { Provider } from "react-redux";
import { Cuenta } from "./components/Cuenta.jsx";
import Home from "./components/Home/Home.jsx";
import { store } from "./store/store.js";
function App() {
  return (
    <Provider store={store}>
      <Cuenta />
      <Home />
    </Provider>
  );
}

export default App;
