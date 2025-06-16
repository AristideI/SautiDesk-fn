import {
  LayoutDashboard,
  Lightbulb,
  Mails,
  MessageSquareQuote,
  Ticket,
} from "lucide-react";

//dashBoard page,  Tickets page, inbox page,   forum page, knowledge base,
export const ORGANISATION_PAGES = [
  {
    path: "/o/organisations/:organisationId",
    name: "Dashboard",
    Icon: LayoutDashboard,
  },
  {
    path: "/o/organisations/:organisationId/tickets",
    name: "Tickets",
    Icon: Ticket,
  },
  {
    path: "/o/organisations/:organisationId/inbox",
    name: "Inbox",
    Icon: MessageSquareQuote,
  },
  {
    path: "/o/organisations/:organisationId/forum",
    name: "Forum",
    Icon: Mails,
  },
  {
    path: "/o/organisations/:organisationId/knowledge-base",
    name: "Knowledge Base",
    Icon: Lightbulb,
  },
];
