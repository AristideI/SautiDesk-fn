import {
  TicketPriority,
  TicketSource,
  TicketState,
  TicketType,
} from "types/ticket.types";

export const ticketSeeds = [
  /* 2 */
  {
    title: "Change billing address",
    description:
      "Customer moved headquarters and needs invoices sent to new address.",
    state: TicketState.ASSIGNED,
    priority: TicketPriority.MEDIUM,
    type: TicketType.REQUEST,
    assignedTo: 11, // Billing Support Officer
    ownedBy: 13, // Call‑Center Rep opened it
    organisation: 1,
    source: TicketSource.MANUAL,
    similarTickets: ["85", "96"],
  },

  /* 3 */
  {
    title: "Slow VPN connection for remote staff",
    description: "Multiple reports of VPN latency >300 ms during peak hours.",
    state: TicketState.IN_PROGRESS,
    priority: TicketPriority.HIGH,
    type: TicketType.PROBLEM,
    assignedTo: 10, // Network Support Engineer
    ownedBy: 17, // IT Helpdesk created it
    organisation: 1,
    source: TicketSource.AI,
    similarTickets: ["85", "96"],
  },

  /* 4 */
  {
    title: "Dispatch request – router replacement",
    description: "Site #204 needs on‑site router swap; device keeps rebooting.",
    state: TicketState.ASSIGNED,
    priority: TicketPriority.MEDIUM,
    type: TicketType.TICKET,
    assignedTo: 12, // Field Service Agent
    ownedBy: 2, // Dispatch Coordinator
    organisation: 1,
    source: TicketSource.MANUAL,
    similarTickets: ["85", "96"],
  },

  /* 5 */
  {
    title: "Escalated complaint: recurring call drops",
    description:
      "VIP client experiencing frequent call drops on premium line; wants root‑cause analysis.",
    state: TicketState.IN_PROGRESS,
    priority: TicketPriority.HIGH,
    type: TicketType.INCIDENT, // choose the enum you use
    assignedTo: 18, // Escalation Specialist
    ownedBy: 14,
    organisation: 1,
    source: TicketSource.MANUAL,
    similarTickets: ["85", "96"],
  },

  /* 6 */
  {
    title: "Quarterly account review scheduling",
    description:
      "Pro‑active check‑in to review SLA metrics with key enterprise account.",
    state: TicketState.OPEN,
    priority: TicketPriority.LOW,
    type: TicketType.SUGGESTION,
    assignedTo: undefined,
    ownedBy: 15, // Customer Success Associate
    organisation: 1,
    source: TicketSource.AI,
  },

  /* 7 */
  {
    title: "Add additional user licences",
    description: "Client requests 25 more user seats for CRM product.",
    state: TicketState.RESOLVED,
    priority: TicketPriority.MEDIUM,
    type: TicketType.REQUEST,
    assignedTo: 16, // Sales Representative
    ownedBy: 16,
    organisation: 1,
    source: TicketSource.MANUAL,
    similarTickets: ["85", "96"],
  },

  /* 8 */
  {
    title: "Incorrect tax calculation on invoice #INV‑00932",
    description:
      "Customer noticed VAT calculated at wrong rate for May billing cycle.",
    state: TicketState.CLOSED,
    priority: TicketPriority.MEDIUM,
    type: TicketType.PROBLEM,
    assignedTo: 11,
    ownedBy: 11,
    organisation: 1,
    source: TicketSource.MANUAL,
  },

  /* 9 */
  {
    title: "Automated alert: CPU utilisation > 90 % on core switch",
    description: "NOC monitoring picked up sustained high CPU for 15 minutes.",
    state: TicketState.ASSIGNED,
    priority: TicketPriority.HIGH,
    type: TicketType.INCIDENT,
    assignedTo: 10,
    ownedBy: 10,
    organisation: 1,
    source: TicketSource.AI,
    similarTickets: ["85", "96"],
  },

  /* 10 */
  {
    title: "Request for training materials – new CRM rollout",
    description:
      "Customer asks for user guides and video tutorials for staff onboarding.",
    state: TicketState.OPEN,
    priority: TicketPriority.LOW,
    type: TicketType.QUESTION,
    assignedTo: undefined,
    ownedBy: 13,
    organisation: 1,
    source: TicketSource.MANUAL,
    similarTickets: ["85", "96"],
  },

  /* 11 */
  {
    title: "Audio quality audit – May call recordings",
    description:
      "Random sample of 50 calls to be reviewed for adherence to quality KPIs.",
    state: TicketState.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    type: TicketType.TICKET,
    assignedTo: 3, // Call Quality Analyst
    ownedBy: 3,
    organisation: 1,
    source: TicketSource.AI,
    similarTickets: ["85", "96"],
  },
];
