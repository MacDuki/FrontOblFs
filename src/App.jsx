import Auth from "./components/Auth";
import { SectionsHome } from "./components/effects/SectionsHome";
import PetStatusPanel from "./components/PetStatusPanel";
import UserHome from "./components/UserHome";
function App() {
  return (
    <>
      <Auth />
      <main className="min-h-screen space-y-2  flex flex-col items-start justify-center p-4 xl:flex-row xl:space-x-8">
        <section className="flex-1 items-center justify-self-center w-full min-h-[650px] border border-red-500">
          <UserHome />
        </section>
        <section className="flex-1 items-center justify-center w-full min-h-[650px] border border-blue-500">
          <SectionsHome />
        </section>
        <section className="flex-1 items-center justify-center w-full min-h-[650px] border border-yellow-500">
          <PetStatusPanel hunger={60} happiness={80} />
        </section>
      </main>
    </>
  );
}

export default App;
