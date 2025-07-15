import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TicketsTable from "../../../components/table/ticketsTable";
import {
  ITicket,
  TicketType,
  TicketState,
  TicketPriority,
} from "../../../types/ticket.types";

// Mock the dependencies
jest.mock("react-router", () => ({
  useNavigate: jest.fn(() => jest.fn()),
  useParams: jest.fn(() => ({ organisationId: "org123" })),
}));

jest.mock("components/utils/tableSkeletons", () => ({
  TicketLoadingSkeleton: () => (
    <div data-testid="loading-skeleton">Loading...</div>
  ),
}));

jest.mock("constants/typeIcons", () => ({
  ticketTypeIcons: {
    BUG: () => <div data-testid="bug-icon">🐛</div>,
    FEATURE: () => <div data-testid="feature-icon">✨</div>,
    OTHER: () => <div data-testid="other-icon">📝</div>,
  },
}));

describe("TicketsTable", () => {
  const mockNavigate = jest.fn();
  const mockTickets: ITicket[] = [
    {
      id: "1",
      documentId: "TICKET-001",
      title: "Test Bug",
      type: TicketType.BUG,
      state: TicketState.OPEN,
      priority: TicketPriority.HIGH,
      assignedTo: {
        documentId: "agent1",
        username: "John Doe",
        profile: { url: "https://example.com/avatar.jpg" },
      },
      createdAt: "2024-01-01T10:00:00Z",
    } as ITicket,
    {
      id: "2",
      documentId: "TICKET-002",
      title: "Test Feature",
      type: TicketType.FEATURE,
      state: TicketState.IN_PROGRESS,
      priority: TicketPriority.MEDIUM,
      assignedTo: null,
      createdAt: "2024-01-02T11:00:00Z",
    } as ITicket,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const { useNavigate } = require("react-router");
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("should render loading skeleton when loading", () => {
    render(<TicketsTable tickets={[]} isLoading={true} />);

    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("should render table headers", () => {
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    expect(screen.getByText("Ticket ID")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Assigned To")).toBeInTheDocument();
    expect(screen.getByText("Request Date")).toBeInTheDocument();
  });

  it("should render ticket data correctly", () => {
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    expect(screen.getByText("TICKET-001")).toBeInTheDocument();
    expect(screen.getByText("Test Bug")).toBeInTheDocument();
    expect(screen.getByText("TICKET-002")).toBeInTheDocument();
    expect(screen.getByText("Test Feature")).toBeInTheDocument();
  });

  it("should render correct ticket type icons", () => {
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    expect(screen.getByTestId("bug-icon")).toBeInTheDocument();
    expect(screen.getByTestId("feature-icon")).toBeInTheDocument();
  });

  it("should render ticket states with correct styling", () => {
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    const openStatus = screen.getByText("OPEN");
    const inProgressStatus = screen.getByText("IN_PROGRESS");

    expect(openStatus).toHaveClass("bg-blue-500/20", "text-blue-400");
    expect(inProgressStatus).toHaveClass("bg-yellow-500/20", "text-yellow-400");
  });

  it("should render ticket priorities with correct styling", () => {
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    const highPriority = screen.getByText("HIGH");
    const mediumPriority = screen.getByText("MEDIUM");

    expect(highPriority).toHaveClass("bg-red-500/20", "text-red-400");
    expect(mediumPriority).toHaveClass("bg-yellow-500/20", "text-yellow-400");
  });

  it("should render assigned agent information", () => {
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Unassigned")).toBeInTheDocument();
  });

  it("should render agent avatar when available", () => {
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    const avatar = screen.getByAltText("");
    expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(avatar).toHaveClass("w-6", "h-6", "rounded-full", "object-cover");
  });

  it("should render placeholder avatar when no profile image", () => {
    const ticketsWithoutAvatar = [
      {
        ...mockTickets[0],
        assignedTo: {
          ...mockTickets[0].assignedTo,
          profile: { url: null },
        },
      },
    ];

    render(<TicketsTable tickets={ticketsWithoutAvatar} isLoading={false} />);

    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("should navigate to ticket when row is clicked", async () => {
    const user = userEvent.setup();
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    const ticketRow = screen.getByText("TICKET-001").closest("tr");
    await user.click(ticketRow!);

    expect(mockNavigate).toHaveBeenCalledWith("TICKET-001");
  });

  it("should navigate to agent when assigned agent is clicked", async () => {
    const user = userEvent.setup();
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    const assignedAgentCell = screen.getByText("John Doe").closest("td");
    await user.click(assignedAgentCell!);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/o/organisations/org123/agents/agent1"
    );
  });

  it('should show "No tickets found" when no tickets exist', () => {
    render(<TicketsTable tickets={[]} isLoading={false} />);

    expect(screen.getByText("No tickets found")).toBeInTheDocument();
  });

  it('should show "No tickets match your filters" when filters are active', () => {
    const getActiveFiltersCount = jest.fn(() => 2);
    render(
      <TicketsTable
        tickets={[]}
        isLoading={false}
        getActiveFiltersCount={getActiveFiltersCount}
      />
    );

    expect(
      screen.getByText("No tickets match your filters")
    ).toBeInTheDocument();
  });

  it("should use filtered tickets when provided", () => {
    const filteredTickets = [mockTickets[0]];
    render(
      <TicketsTable
        tickets={mockTickets}
        filteredTickets={filteredTickets}
        isLoading={false}
      />
    );

    expect(screen.getByText("TICKET-001")).toBeInTheDocument();
    expect(screen.queryByText("TICKET-002")).not.toBeInTheDocument();
  });

  it("should format dates correctly", () => {
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    expect(screen.getByText("01/01/2024, 10:00")).toBeInTheDocument();
    expect(screen.getByText("02/01/2024, 11:00")).toBeInTheDocument();
  });

  it("should have correct table structure", () => {
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    const table = screen.getByRole("table");
    expect(table).toHaveClass("w-full", "border-collapse");

    const thead = table.querySelector("thead");
    expect(thead).toHaveClass("font-semibold");

    const tbody = table.querySelector("tbody");
    expect(tbody).toHaveClass("text-sm");
  });

  it("should have hover effects on table rows", () => {
    render(<TicketsTable tickets={mockTickets} isLoading={false} />);

    const rows = screen.getAllByRole("row").slice(1); // Skip header row
    rows.forEach((row) => {
      expect(row).toHaveClass("hover:bg-white/5");
    });
  });

  it("should handle empty assignedTo gracefully", () => {
    const ticketsWithNullAssignment = [
      {
        ...mockTickets[0],
        assignedTo: null,
      },
    ];

    render(
      <TicketsTable tickets={ticketsWithNullAssignment} isLoading={false} />
    );

    expect(screen.getByText("Unassigned")).toBeInTheDocument();
  });

  it("should handle unknown ticket types", () => {
    const ticketsWithUnknownType = [
      {
        ...mockTickets[0],
        type: "UNKNOWN_TYPE" as TicketType,
      },
    ];

    render(<TicketsTable tickets={ticketsWithUnknownType} isLoading={false} />);

    expect(screen.getByTestId("other-icon")).toBeInTheDocument();
  });
});
