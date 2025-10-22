import Auth from "./components/Auth";
import Card from "./components/Card";
import UserProfile from "./components/UserProfile";
function App() {
  return (
    <>
      <Auth />
      <main className="min-h-screen space-y-2  flex flex-col items-center justify-center p-4 xl:flex-row xl:space-x-8">
        <Card className="w-full xl:w-1/3 h-[600px]">
          <UserProfile />
        </Card>
        <Card className="w-full xl:w-1/3 h-[600px]">
          <UserProfile />
        </Card>
        <Card className="w-full xl:w-1/3 h-[600px]">
          <UserProfile />
        </Card>
      </main>
    </>
  );
}

export default App;
