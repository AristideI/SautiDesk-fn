import { getPriorityColor, getStateColor } from "../../utils/getColors";
import { TicketPriority, TicketState } from "../../types/ticket.types";

describe("getPriorityColor", () => {
  it("should return correct color for HIGH priority", () => {
    const color = getPriorityColor(TicketPriority.HIGH);
    expect(color).toBe("text-red-400 bg-red-500/20");
  });

  it("should return correct color for MEDIUM priority", () => {
    const color = getPriorityColor(TicketPriority.MEDIUM);
    expect(color).toBe("text-yellow-400 bg-yellow-500/20");
  });

  it("should return correct color for LOW priority", () => {
    const color = getPriorityColor(TicketPriority.LOW);
    expect(color).toBe("text-green-400 bg-green-500/20");
  });

  it("should return default color for unknown priority", () => {
    const color = getPriorityColor("UNKNOWN" as TicketPriority);
    expect(color).toBe("text-gray-400 bg-gray-500/20");
  });
});

describe("getStateColor", () => {
  it("should return correct color for OPEN state", () => {
    const color = getStateColor(TicketState.OPEN);
    expect(color).toBe("text-blue-400 bg-blue-500/20");
  });

  it("should return correct color for IN_PROGRESS state", () => {
    const color = getStateColor(TicketState.IN_PROGRESS);
    expect(color).toBe("text-yellow-400 bg-yellow-500/20");
  });

  it("should return correct color for RESOLVED state", () => {
    const color = getStateColor(TicketState.RESOLVED);
    expect(color).toBe("text-green-400 bg-green-500/20");
  });

  it("should return correct color for CLOSED state", () => {
    const color = getStateColor(TicketState.CLOSED);
    expect(color).toBe("text-gray-400 bg-gray-500/20");
  });

  it("should return default color for unknown state", () => {
    const color = getStateColor("UNKNOWN" as TicketState);
    expect(color).toBe("text-gray-400 bg-gray-500/20");
  });
});
