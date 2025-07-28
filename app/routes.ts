import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("../components/layouts/generalLayout.tsx", [
    // Public routes
    index("routes/general/homePage.tsx"),
    route("login", "routes/general/loginPage.tsx"),
    route("register", "routes/general/registerPage.tsx"),
    route("help", "routes/general/helpPage.tsx"),
    route("contact", "routes/general/contactPage.tsx"),
    route("pricing", "routes/general/pricingPage.tsx"),
    route("resources", "routes/general/resources.tsx"),
    route("health", "routes/general/health.tsx"),
  ]),

  // Authenticated routes
  layout("../components/layouts/authenticatedLayout.tsx", [
    route("profile", "routes/_auth/_general/profilePage.tsx"),
  ]),

  layout("../components/layouts/mainLayout.tsx", [
    // Organisation Owner - /o/*
    route("o/organisations", "routes/_auth/_owner/organisationsPage.tsx"),
    layout("../components/layouts/organisationLayout.tsx", [
      route(
        "o/organisations/:organisationId",
        "routes/_auth/_owner/viewOrganisation.tsx"
      ),
      route(
        "o/organisations/:organisationId/tickets",
        "routes/_auth/_owner/orgTicketsPage.tsx"
      ),
      route(
        "o/organisations/:organisationId/tickets/:ticketId",
        "routes/_auth/_owner/viewTicketPage.tsx"
      ),
      route(
        "o/organisations/:organisationId/agents",
        "routes/_auth/_owner/orgUsersPage.tsx"
      ),
      route(
        "o/organisations/:organisationId/agents/:agentId",
        "routes/_auth/_owner/viewAgentPage.tsx"
      ),
      route(
        "o/organisations/:organisationId/knowledge-base",
        "routes/_auth/_owner/KnowledgeBase.tsx"
      ),
      route(
        "o/organisations/:organisationId/inbox",
        "routes/_auth/_owner/orgInboxPage.tsx"
      ),
      route(
        "o/organisations/:organisationId/forum",
        "routes/_auth/_owner/forumPage.tsx"
      ),
    ]),

    //   // Organisation Member - /m/*
    //   route("m/dashboard", "routes/_auth/_member/dashboard.tsx"),
    //   route("m/create-ticket", "routes/_auth/_member/create-ticket.tsx"),
    //   route("m/view-tickets", "routes/_auth/_member/view-tickets.tsx"),
    //   route("m/knowledge-base", "routes/_auth/_member/knowledge-base.tsx"),
    //   route("m/inbox", "routes/_auth/_member/inbox.tsx"),
  ]),
] satisfies RouteConfig;
