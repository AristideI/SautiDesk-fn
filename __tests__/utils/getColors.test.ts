import { getPriorityColor, getStateColor } from "../../utils/getColors";
import { TicketPriority, TicketState } from "../../types/ticket.types";
import { describe, it, expect } from "@jest/globals";

describe("getColors", () => {
  it("should return priority color for HIGH priority", () => {
    const color = getPriorityColor(TicketPriority.HIGH);
    expect(color).toBe("text-red-400 bg-red-500/20");
  });

  it("should return state color for OPEN state", () => {
    const color = getStateColor(TicketState.OPEN);
    expect(color).toBe("text-blue-400 bg-blue-500/20");
  });
});
