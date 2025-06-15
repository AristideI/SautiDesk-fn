import Logo from "components/utils/logo";
import { OrgUserButton } from "components/utils/userButton";
import { Power } from "lucide-react";
import { Outlet } from "react-router";

export default function OrganisationLayout() {
  return (
    <main className="flex justify-end relative w-full min-h-screen">
      <aside className="w-1/6 absolute h-screen top-0 left-0 bg-black p-4 flex flex-col justify-between">
        <OrgUserButton />
        <section className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">Powered By</p>
            <Logo />
          </div>
          <div>
            <Power />
          </div>
        </section>
      </aside>
      <article className="w-5/6 bg-red-100/5">
        <Outlet />
      </article>
    </main>
  );
}
