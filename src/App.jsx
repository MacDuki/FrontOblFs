import DiscoverBooks from "./components/discoverbooks/DiscoverBooks.jsx"
import Auth from "./components/Auth.jsx";
// import Auth from "./components/Auth"; // ← lo dejamos comentado por ahora

function App() {
  return (
    <>
      <Auth/>
      <DiscoverBooks />
    </>
  );
}

export default App;
