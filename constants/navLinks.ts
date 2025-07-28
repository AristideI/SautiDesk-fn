import {
  Bell,
  LayoutDashboard,
  Lightbulb,
  MessageSquareQuote,
  Ticket,
  Users,
} from "lucide-react";

export const navLinks = (organisationId: string) => {
  return [
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
      path: `/o/organisations/${organisationId}/notifications`,
      name: "Notifications",
      Icon: Bell,
    },
    {
      path: `/o/organisations/${organisationId}/agents`,
      name: "Agents",
      Icon: Users,
    },
    {
      path: `/o/organisations/${organisationId}/inbox`,
      name: "Inbox",
      Icon: MessageSquareQuote,
    },
    {
      path: `/o/organisations/${organisationId}/knowledge-base`,
      name: "Knowledge Base",
      Icon: Lightbulb,
    },
  ];
};

export const agentNavLinks = () => {
  return [
    {
      path: "/a/tickets",
      name: "Tickets",
      Icon: Ticket,
    },
    {
      path: "/a/knowledge-base",
      name: "Knowledge Base",
      Icon: Lightbulb,
    },
    {
      path: "/a/inbox",
      name: "Inbox",
      Icon: MessageSquareQuote,
    },
    {
      path: "/a/notifications",
      name: "Notifications",
      Icon: Bell,
    },
  ];
};
