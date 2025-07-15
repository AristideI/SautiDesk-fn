import { getTicketCount } from "../../helpers/getTicketCount";
import type { ITicket } from "../../types/ticket.types";
import { describe, it, expect } from "@jest/globals";

describe("getTicketCount", () => {
  const mockTickets: ITicket[] = [
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
    {
      id: "4",
      title: "Ticket 4",
      assignedTo: null,
    },
  ] as ITicket[];

  it("should return 0 when tickets is null", () => {
    const count = getTicketCount(null, "agent1");
    expect(count).toBe(0);
  });

  it("should return 0 when tickets is empty array", () => {
    const count = getTicketCount([], "agent1");
    expect(count).toBe(0);
  });

  it("should return correct count for agent with assigned tickets", () => {
    const count = getTicketCount(mockTickets, "agent1");
    expect(count).toBe(2);
  });

  it("should return 0 for agent with no assigned tickets", () => {
    const count = getTicketCount(mockTickets, "agent3");
    expect(count).toBe(0);
  });

  it("should handle tickets with null assignedTo", () => {
    const count = getTicketCount(mockTickets, "agent1");
    expect(count).toBe(2); // Should not count tickets with null assignedTo
  });

  it("should return correct count for different agents", () => {
    const count1 = getTicketCount(mockTickets, "agent1");
    const count2 = getTicketCount(mockTickets, "agent2");

    expect(count1).toBe(2);
    expect(count2).toBe(1);
  });
});
