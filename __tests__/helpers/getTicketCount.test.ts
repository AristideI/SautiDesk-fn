import { getTicketCount } from "../../helpers/getTicketCount";
import { describe, it, expect } from "@jest/globals";

describe("getTicketCount", () => {
  const mockTickets = [
    {
      id: "1",
      title: "Ticket 1",
      assignedTo: { documentId: "agent1", username: "Agent 1" },
    },
    {
      id: "2",
      title: "Ticket 2",
      assignedTo: { documentId: "agent1", username: "Agent 1" },
    },
    {
      id: "3",
      title: "Ticket 3",
      assignedTo: { documentId: "agent2", username: "Agent 2" },
    },
  ];

  it("should return 0 when tickets is empty array", () => {
    const count = getTicketCount([], "agent1");
    expect(count).toBe(0);
  });

  it("should return correct count for agent with assigned tickets", () => {
    const count = getTicketCount(mockTickets as any, "agent1");
    expect(count).toBe(2);
  });
});
