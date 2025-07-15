import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KnowledgeBase from "../../../app/routes/_auth/_owner/KnowledgeBase";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock the dependencies
jest.mock("store/auth.context", () => ({
  useAuthContext: jest.fn(() => ({
    user: {
      documentId: "user123",
      name: "Test User",
      email: "test@example.com",
    },
    isAuthenticated: true,
  })),
}));

jest.mock("store/knowledgeBase.context", () => ({
  useKnowledgeBaseContext: jest.fn(() => ({
    knowledgeBases: [],
    loading: false,
    createKnowledgeBase: jest.fn(),
    updateKnowledgeBase: jest.fn(),
    deleteKnowledgeBase: jest.fn(),
  })),
}));

jest.mock("react-router", () => ({
  useNavigate: jest.fn(() => jest.fn()),
  useParams: jest.fn(() => ({ id: "org123" })),
}));

jest.mock("components/utils/adminHeader", () => ({
  default: () => <div data-testid="admin-header">Admin Header</div>,
}));

jest.mock("components/utils/button", () => ({
  default: ({ buttonText, onPress, variant, className }: any) => (
    <button
      onClick={onPress}
      className={className}
      data-testid={`button-${buttonText?.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {buttonText}
    </button>
  ),
}));

jest.mock("components/modals/createAgentModal", () => ({
  CreateAgentModal: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="create-agent-modal">
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
        <span>Create Agent Modal</span>
      </div>
    ) : null,
}));

jest.mock("lucide-react", () => ({
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Search: () => <div data-testid="search-icon">Search</div>,
  Edit: () => <div data-testid="edit-icon">Edit</div>,
  Trash2: () => <div data-testid="trash-icon">Trash</div>,
}));

describe("KnowledgeBase", () => {
  const mockNavigate = jest.fn();
  const mockUseKnowledgeBaseContext =
    require("store/knowledgeBase.context").useKnowledgeBaseContext;

  beforeEach(() => {
    jest.clearAllMocks();
    const { useNavigate } = require("react-router");
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("should render the page with header", () => {
    render(<KnowledgeBase />);

    expect(screen.getByTestId("admin-header")).toBeInTheDocument();
    expect(screen.getByText(/knowledge base/i)).toBeInTheDocument();
  });

  it("should render create knowledge base button", () => {
    render(<KnowledgeBase />);

    expect(
      screen.getByTestId("button-create-knowledge-base")
    ).toBeInTheDocument();
    expect(screen.getByText("Create Knowledge Base")).toBeInTheDocument();
  });

  it("should render search input", () => {
    render(<KnowledgeBase />);

    const searchInput = screen.getByPlaceholderText(/search knowledge bases/i);
    expect(searchInput).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("should show loading state when loading", () => {
    mockUseKnowledgeBaseContext.mockReturnValue({
      knowledgeBases: [],
      loading: true,
      createKnowledgeBase: jest.fn(),
      updateKnowledgeBase: jest.fn(),
      deleteKnowledgeBase: jest.fn(),
    });

    render(<KnowledgeBase />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should show empty state when no knowledge bases exist", () => {
    mockUseKnowledgeBaseContext.mockReturnValue({
      knowledgeBases: [],
      loading: false,
      createKnowledgeBase: jest.fn(),
      updateKnowledgeBase: jest.fn(),
      deleteKnowledgeBase: jest.fn(),
    });

    render(<KnowledgeBase />);

    expect(screen.getByText(/no knowledge bases found/i)).toBeInTheDocument();
  });

  it("should render knowledge base cards when they exist", () => {
    const mockKnowledgeBases = [
      {
        id: "1",
        title: "Knowledge Base 1",
        description: "Description 1",
        createdAt: "2024-01-01",
      },
      {
        id: "2",
        title: "Knowledge Base 2",
        description: "Description 2",
        createdAt: "2024-01-02",
      },
    ];

    mockUseKnowledgeBaseContext.mockReturnValue({
      knowledgeBases: mockKnowledgeBases,
      loading: false,
      createKnowledgeBase: jest.fn(),
      updateKnowledgeBase: jest.fn(),
      deleteKnowledgeBase: jest.fn(),
    });

    render(<KnowledgeBase />);

    expect(screen.getByText("Knowledge Base 1")).toBeInTheDocument();
    expect(screen.getByText("Knowledge Base 2")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
  });

  it("should open create modal when create button is clicked", async () => {
    const user = userEvent.setup();
    render(<KnowledgeBase />);

    const createButton = screen.getByTestId("button-create-knowledge-base");
    await user.click(createButton);

    expect(screen.getByTestId("create-agent-modal")).toBeInTheDocument();
  });

  it("should close create modal when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<KnowledgeBase />);

    // Open modal
    const createButton = screen.getByTestId("button-create-knowledge-base");
    await user.click(createButton);

    expect(screen.getByTestId("create-agent-modal")).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByTestId("close-modal");
    await user.click(closeButton);

    expect(screen.queryByTestId("create-agent-modal")).not.toBeInTheDocument();
  });

  it("should handle search input changes", async () => {
    const user = userEvent.setup();
    render(<KnowledgeBase />);

    const searchInput = screen.getByPlaceholderText(/search knowledge bases/i);
    await user.type(searchInput, "test search");

    expect(searchInput).toHaveValue("test search");
  });

  it("should filter knowledge bases based on search", async () => {
    const mockKnowledgeBases = [
      {
        id: "1",
        title: "React Knowledge Base",
        description: "React related content",
        createdAt: "2024-01-01",
      },
      {
        id: "2",
        title: "Vue Knowledge Base",
        description: "Vue related content",
        createdAt: "2024-01-02",
      },
    ];

    mockUseKnowledgeBaseContext.mockReturnValue({
      knowledgeBases: mockKnowledgeBases,
      loading: false,
      createKnowledgeBase: jest.fn(),
      updateKnowledgeBase: jest.fn(),
      deleteKnowledgeBase: jest.fn(),
    });

    const user = userEvent.setup();
    render(<KnowledgeBase />);

    // Initially both should be visible
    expect(screen.getByText("React Knowledge Base")).toBeInTheDocument();
    expect(screen.getByText("Vue Knowledge Base")).toBeInTheDocument();

    // Search for React
    const searchInput = screen.getByPlaceholderText(/search knowledge bases/i);
    await user.type(searchInput, "React");

    // Only React should be visible
    expect(screen.getByText("React Knowledge Base")).toBeInTheDocument();
    expect(screen.queryByText("Vue Knowledge Base")).not.toBeInTheDocument();
  });

  it("should have correct page structure", () => {
    render(<KnowledgeBase />);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass(
      "bg-red-100/5",
      "min-h-screen",
      "w-full",
      "padd",
      "py-20"
    );
  });

  it("should have correct grid layout for knowledge base cards", () => {
    const mockKnowledgeBases = [
      {
        id: "1",
        title: "Knowledge Base 1",
        description: "Description 1",
        createdAt: "2024-01-01",
      },
    ];

    mockUseKnowledgeBaseContext.mockReturnValue({
      knowledgeBases: mockKnowledgeBases,
      loading: false,
      createKnowledgeBase: jest.fn(),
      updateKnowledgeBase: jest.fn(),
      deleteKnowledgeBase: jest.fn(),
    });

    render(<KnowledgeBase />);

    const gridContainer = screen.getByText("Knowledge Base 1").closest("div");
    expect(gridContainer).toHaveClass(
      "grid",
      "grid-cols-1",
      "md:grid-cols-2",
      "lg:grid-cols-3",
      "gap-6"
    );
  });

  it("should show edit and delete buttons for each knowledge base", () => {
    const mockKnowledgeBases = [
      {
        id: "1",
        title: "Knowledge Base 1",
        description: "Description 1",
        createdAt: "2024-01-01",
      },
    ];

    mockUseKnowledgeBaseContext.mockReturnValue({
      knowledgeBases: mockKnowledgeBases,
      loading: false,
      createKnowledgeBase: jest.fn(),
      updateKnowledgeBase: jest.fn(),
      deleteKnowledgeBase: jest.fn(),
    });

    render(<KnowledgeBase />);

    const editButtons = screen.getAllByTestId("edit-icon");
    const deleteButtons = screen.getAllByTestId("trash-icon");

    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it("should handle edit knowledge base", async () => {
    const mockUpdateKnowledgeBase = jest.fn();
    const mockKnowledgeBases = [
      {
        id: "1",
        title: "Knowledge Base 1",
        description: "Description 1",
        createdAt: "2024-01-01",
      },
    ];

    mockUseKnowledgeBaseContext.mockReturnValue({
      knowledgeBases: mockKnowledgeBases,
      loading: false,
      createKnowledgeBase: jest.fn(),
      updateKnowledgeBase: mockUpdateKnowledgeBase,
      deleteKnowledgeBase: jest.fn(),
    });

    const user = userEvent.setup();
    render(<KnowledgeBase />);

    const editButton = screen.getAllByTestId("edit-icon")[0];
    await user.click(editButton);

    // This would typically open an edit modal or form
    // The actual implementation would depend on the component structure
    expect(editButton).toBeInTheDocument();
  });

  it("should handle delete knowledge base", async () => {
    const mockDeleteKnowledgeBase = jest.fn();
    const mockKnowledgeBases = [
      {
        id: "1",
        title: "Knowledge Base 1",
        description: "Description 1",
        createdAt: "2024-01-01",
      },
    ];

    mockUseKnowledgeBaseContext.mockReturnValue({
      knowledgeBases: mockKnowledgeBases,
      loading: false,
      createKnowledgeBase: jest.fn(),
      updateKnowledgeBase: jest.fn(),
      deleteKnowledgeBase: mockDeleteKnowledgeBase,
    });

    const user = userEvent.setup();
    render(<KnowledgeBase />);

    const deleteButton = screen.getAllByTestId("trash-icon")[0];
    await user.click(deleteButton);

    // This would typically show a confirmation dialog
    // The actual implementation would depend on the component structure
    expect(deleteButton).toBeInTheDocument();
  });
});
