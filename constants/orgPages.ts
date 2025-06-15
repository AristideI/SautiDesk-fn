import { LayoutDashboard, Ticket } from "lucide-react";

//dashBoard page,  Tickets page, inbox page,   forum page, knowledge base,
export const ORGANISATION_PAGES = [
  {
    path: "/organisations/:organisationId",
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/organisations/:organisationId/tickets",
    name: "Tickets",
    icon: Ticket,
  },
  {
    path: "",
  },
];
