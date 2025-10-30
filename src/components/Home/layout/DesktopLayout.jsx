import { PetHome } from "../Pet/PetHome";
import { SectionsHome } from "../SectionsHome";
import UserHome from "../UserHome";

function DesktopLayout() {
  return (
    <main className="hidden lg:flex flex-col h-screen gap-10 overflow-hidden items-center justify-center p-4 lg:flex-row">
      <section className="flex-1 gap-4 flex flex-col h-fit max-h-[600px] ">
        <UserHome />
        <PetHome />
      </section>
      <section className="flex-3 h-fit max-h-[600px]">
        <SectionsHome />
      </section>
    </main>
  );
}

export default DesktopLayout;
