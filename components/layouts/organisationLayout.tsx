import React from "react";
import Logo from "components/utils/logo";
import { OrgUserButton } from "components/utils/userButton";
import {
  LayoutDashboard,
  Lightbulb,
  Mails,
  MessageSquareQuote,
  Power,
  Ticket,
  Users,
} from "lucide-react";
import { NavLink, Outlet, useParams } from "react-router";
import OrganisationContextProvider from "store/organisation.context";

export default function OrganisationLayout() {
  const { organisationId } = useParams();

  const navLinks = [
    {
      path: `/o/organisations/${organisationId}`,
      name: "Dashboard",
      Icon: LayoutDashboard,
    },
    {
      path: `/o/organisations/${organisationId}/tickets`,
      name: "Tickets",
      Icon: Ticket,
    },
    {
      path: `/o/organisations/${organisationId}/manage-users`,
      name: "Manage Users",
      Icon: Users,
    },
    {
      path: `/o/organisations/${organisationId}/inbox`,
      name: "Inbox",
      Icon: MessageSquareQuote,
    },
    {
      path: `/o/organisations/${organisationId}/forum`,
      name: "Forum",
      Icon: Mails,
    },
    {
      path: `/o/organisations/${organisationId}/knowledge-base`,
      name: "Knowledge Base",
      Icon: Lightbulb,
    },
  ];
  return (
    <OrganisationContextProvider organisationId={organisationId}>
      <main className="flex justify-end relative w-full min-h-screen">
        <aside className="w-1/6 absolute h-screen top-0 left-0 bg-black p-4 flex flex-col justify-between">
          <OrgUserButton />
          <section className="flex flex-col gap-2 flex-1 pt-10">
            {navLinks.map((page) => (
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

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `${baseStyle} ${isActive ? activeStyle : ""}`
      }
    >
      <Icon size={20} />
      {name}
    </NavLink>
  );
}
