import Logo from "components/utils/logo";
import { OrgUserButton } from "components/utils/userButton";
import { Power } from "lucide-react";
import { NavLink, Outlet, useMatch, useParams } from "react-router";
import OrganisationContextProvider from "store/organisation.context";
import { navLinks } from "constants/navLinks";
import { useAuthContext } from "store/auth.context";

export default function OrganisationLayout() {
  const { organisationId } = useParams();
  const { logout } = useAuthContext();

  return (
    <OrganisationContextProvider organisationId={organisationId}>
      <main className="flex justify-end relative w-full min-h-screen">
        <aside className="w-1/6 fixed h-screen top-0 left-0 bg-black p-4 flex flex-col justify-between">
          <OrgUserButton />
          <section className="flex flex-col gap-2 flex-1 pt-10">
            {navLinks(organisationId || "").map((page) => (
              <AsideLink
                key={page.name}
                name={page.name}
                Icon={page.Icon}
                path={page.path}
              />
            ))}
          </section>
          <section className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50">Powered By</p>
              <Logo notClickable isSmall />
            </div>
            <div>
              <button
                className="text-white/70 rounded-lg p-2 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={logout}
              >
                <Power size={20} />
              </button>
            </div>
          </section>
        </aside>
        <article className="w-5/6 bg-red-100/5">
          <Outlet />
        </article>
      </main>
    </OrganisationContextProvider>
  );
}

interface NavLinkProps {
  path: string;
  name: string;
  Icon: React.ElementType;
}

export function AsideLink({ path, name, Icon }: NavLinkProps) {
  const activeStyle = "bg-white/10 text-white font-bold";
  const baseStyle =
    "text-white/70 flex items-center gap-2 px-4 py-2 text-sm hover:text-red transition-colors rounded-lg";

  const isActive = useMatch(path);

  return (
    <NavLink
      to={path}
      className={() => `${baseStyle} ${isActive ? activeStyle : ""}`}
    >
      <Icon size={20} />
      {name}
    </NavLink>
  );
}
