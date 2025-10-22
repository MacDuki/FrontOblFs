import Auth from "./components/Auth";
import UserProfile from "./components/UserProfile";
function App() {
  return (
    <>
      <Auth />
      <main className="min-h-screen space-y-2  flex flex-col items-center justify-center p-4 xl:flex-row xl:space-x-8">
        <UserProfile />

        <UserProfile />

        <UserProfile />
      </main>
    </>
  );
}

export default App;
