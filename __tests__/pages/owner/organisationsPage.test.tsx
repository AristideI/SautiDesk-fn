import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrganisationsPage from "../../../app/routes/_auth/_owner/organisationsPage";
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

jest.mock("hooks/useOrganisations", () => ({
  default: jest.fn(() => ({
    organisations: [],
    loading: false,
  })),
}));

jest.mock("react-router", () => ({
  useNavigate: jest.fn(() => jest.fn()),
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

jest.mock("../components/cards/organisationCard", () => ({
  default: ({ organisation, onClick }: any) => (
    <div
      onClick={onClick}
      data-testid={`org-card-${organisation.documentId}`}
      className="org-card"
    >
      {organisation.name}
    </div>
  ),
}));

jest.mock("components/modals/createOrganisationModal", () => ({
  CreateOrganisationModal: ({ isOpen, onClose, user }: any) =>
    isOpen ? (
      <div data-testid="create-org-modal">
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
        <span>Create Organisation Modal</span>
      </div>
    ) : null,
}));

jest.mock("components/utils/orgSkeleton", () => ({
  default: () => <div data-testid="loading-skeleton">Loading...</div>,
}));

jest.mock("lucide-react", () => ({
  Search: () => <div data-testid="search-icon">Search</div>,
}));

describe("OrganisationsPage", () => {
  const mockNavigate = jest.fn();
  const mockUseOrganisations = require("hooks/useOrganisations").default;

  beforeEach(() => {
    jest.clearAllMocks();
    const { useNavigate } = require("react-router");
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("should render the page with header", () => {
    render(<OrganisationsPage />);

    expect(screen.getByTestId("admin-header")).toBeDefined();
    expect(screen.getByText("Your Organisations")).toBeDefined();
  });

  it("should render create organisation button", () => {
    render(<OrganisationsPage />);

    expect(screen.getByTestId("button-create-organisation")).toBeDefined();
    expect(screen.getByText("Create Organisation")).toBeDefined();
  });

  it("should render search input", () => {
    render(<OrganisationsPage />);

    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toBeDefined();
    expect(screen.getByTestId("search-icon")).toBeDefined();
  });

  it("should show loading skeleton when loading", () => {
    mockUseOrganisations.mockReturnValue({
      organisations: [],
      loading: true,
    });

    render(<OrganisationsPage />);

    expect(screen.getByTestId("loading-skeleton")).toBeDefined();
  });

  it("should show no organisations message when empty", () => {
    mockUseOrganisations.mockReturnValue({
      organisations: [],
      loading: false,
    });

    render(<OrganisationsPage />);

    expect(screen.getByText("No organisations found.")).toBeDefined();
  });

  it("should render organisation cards when organisations exist", () => {
    const mockOrganisations = [
      {
        id: "1",
        documentId: "org1",
        name: "Organisation 1",
      },
      {
        id: "2",
        documentId: "org2",
        name: "Organisation 2",
      },
    ];

    mockUseOrganisations.mockReturnValue({
      organisations: mockOrganisations,
      loading: false,
    });

    render(<OrganisationsPage />);

    expect(screen.getByTestId("org-card-org1")).toBeDefined();
    expect(screen.getByTestId("org-card-org2")).toBeDefined();
    expect(screen.getByText("Organisation 1")).toBeDefined();
    expect(screen.getByText("Organisation 2")).toBeDefined();
  });

  it("should open create modal when create button is clicked", async () => {
    const user = userEvent.setup();
    render(<OrganisationsPage />);

    const createButton = screen.getByTestId("button-create-organisation");
    await user.click(createButton);

    expect(screen.getByTestId("create-org-modal")).toBeDefined();
  });

  it("should close create modal when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<OrganisationsPage />);

    // Open modal
    const createButton = screen.getByTestId("button-create-organisation");
    await user.click(createButton);

    expect(screen.getByTestId("create-org-modal")).toBeDefined();

    // Close modal
    const closeButton = screen.getByTestId("close-modal");
    await user.click(closeButton);

    expect(screen.queryByTestId("create-org-modal")).not.toBeDefined();
  });

  it("should navigate to organisation when card is clicked", async () => {
    const mockOrganisations = [
      {
        id: "1",
        documentId: "org1",
        name: "Organisation 1",
      },
    ];

    mockUseOrganisations.mockReturnValue({
      organisations: mockOrganisations,
      loading: false,
    });

    const user = userEvent.setup();
    render(<OrganisationsPage />);

    const orgCard = screen.getByTestId("org-card-org1");
    await user.click(orgCard);

    expect(mockNavigate).toHaveBeenCalledWith("/o/organisations/org1");
  });

  it("should handle search input changes", async () => {
    const user = userEvent.setup();
    render(<OrganisationsPage />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "test search");

    expect(searchInput).toContain("test search");
  });

  it("should have correct page structure", () => {
    render(<OrganisationsPage />);

    const main = screen.getByRole("main");
    expect(main).toBeDefined();
  });

  it("should have correct grid layout for organisation cards", () => {
    const mockOrganisations = [
      {
        id: "1",
        documentId: "org1",
        name: "Organisation 1",
      },
    ];

    mockUseOrganisations.mockReturnValue({
      organisations: mockOrganisations,
      loading: false,
    });

    render(<OrganisationsPage />);

    const gridContainer = screen.getByText("Organisation 1").closest("div");
    expect(gridContainer).toBeDefined();
  });
});
