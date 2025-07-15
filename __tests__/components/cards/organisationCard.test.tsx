import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrganisationCard from "../../../components/cards/organisationCard";
import { IOrganisation } from "../../../types/organisation.type";

// Mock the dependencies
jest.mock("lucide-react", () => ({
  Boxes: () => <div data-testid="boxes-icon">📦</div>,
}));

describe("OrganisationCard", () => {
  const mockOrganisation: IOrganisation = {
    id: "1",
    documentId: "org123",
    name: "Test Organisation",
    description: "A test organisation",
    agents: [
      { id: "1", name: "Agent 1" },
      { id: "2", name: "Agent 2" },
    ],
    createdAt: "2024-01-01",
  } as IOrganisation;

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render organisation name", () => {
    render(
      <OrganisationCard organisation={mockOrganisation} onClick={mockOnClick} />
    );

    expect(screen.getByText("Test Organisation")).toBeInTheDocument();
  });

  it("should render agent count", () => {
    render(
      <OrganisationCard organisation={mockOrganisation} onClick={mockOnClick} />
    );

    expect(screen.getByText("2 Agents.")).toBeInTheDocument();
  });

  it("should render boxes icon", () => {
    render(
      <OrganisationCard organisation={mockOrganisation} onClick={mockOnClick} />
    );

    expect(screen.getByTestId("boxes-icon")).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    render(
      <OrganisationCard organisation={mockOrganisation} onClick={mockOnClick} />
    );

    const card = screen.getByRole("button");
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should handle organisation with no agents", () => {
    const organisationWithoutAgents = {
      ...mockOrganisation,
      agents: [],
    };

    render(
      <OrganisationCard
        organisation={organisationWithoutAgents}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("0 Agents.")).toBeInTheDocument();
  });

  it("should handle organisation with null agents", () => {
    const organisationWithNullAgents = {
      ...mockOrganisation,
      agents: null,
    };

    render(
      <OrganisationCard
        organisation={organisationWithNullAgents}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("0 Agents.")).toBeInTheDocument();
  });

  it("should handle organisation with undefined agents", () => {
    const organisationWithUndefinedAgents = {
      ...mockOrganisation,
      agents: undefined,
    };

    render(
      <OrganisationCard
        organisation={organisationWithUndefinedAgents}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("0 Agents.")).toBeInTheDocument();
  });

  it("should have correct button structure", () => {
    render(
      <OrganisationCard organisation={mockOrganisation} onClick={mockOnClick} />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "flex",
      "gap-3",
      "p-4",
      "bg-white/10",
      "rounded-lg",
      "shadow-md",
      "cursor-pointer",
      "hover:shadow-lg",
      "hover:bg-black",
      "transition-all",
      "border",
      "border-white/60"
    );
  });

  it("should have correct icon container styling", () => {
    render(
      <OrganisationCard organisation={mockOrganisation} onClick={mockOnClick} />
    );

    const iconContainer = screen.getByTestId("boxes-icon").parentElement;
    expect(iconContainer).toHaveClass(
      "bg-black",
      "w-fit",
      "h-fit",
      "p-2",
      "rounded-full"
    );
  });

  it("should have correct text container styling", () => {
    render(
      <OrganisationCard organisation={mockOrganisation} onClick={mockOnClick} />
    );

    const textContainer = screen.getByText("Test Organisation").parentElement;
    expect(textContainer).toHaveClass(
      "flex",
      "flex-col",
      "justify-start",
      "items-start"
    );
  });

  it("should have correct name styling", () => {
    render(
      <OrganisationCard organisation={mockOrganisation} onClick={mockOnClick} />
    );

    const nameElement = screen.getByText("Test Organisation");
    expect(nameElement).toHaveClass("font-semibold", "text-sm");
  });

  it("should have correct agent count styling", () => {
    render(
      <OrganisationCard organisation={mockOrganisation} onClick={mockOnClick} />
    );

    const agentCountElement = screen.getByText("2 Agents.");
    expect(agentCountElement).toHaveClass("text-sm", "text-gray-400");
  });

  it("should work without onClick handler", () => {
    render(<OrganisationCard organisation={mockOrganisation} />);

    const card = screen.getByRole("button");
    expect(card).toBeInTheDocument();
    expect(screen.getByText("Test Organisation")).toBeInTheDocument();
  });

  it("should handle long organisation names", () => {
    const organisationWithLongName = {
      ...mockOrganisation,
      name: "This is a very long organisation name that might overflow",
    };

    render(
      <OrganisationCard
        organisation={organisationWithLongName}
        onClick={mockOnClick}
      />
    );

    expect(
      screen.getByText(
        "This is a very long organisation name that might overflow"
      )
    ).toBeInTheDocument();
  });

  it("should handle special characters in organisation name", () => {
    const organisationWithSpecialChars = {
      ...mockOrganisation,
      name: "Test Org & Co. (Ltd.)",
    };

    render(
      <OrganisationCard
        organisation={organisationWithSpecialChars}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("Test Org & Co. (Ltd.)")).toBeInTheDocument();
  });

  it("should handle large number of agents", () => {
    const organisationWithManyAgents = {
      ...mockOrganisation,
      agents: Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        name: `Agent ${i}`,
      })),
    };

    render(
      <OrganisationCard
        organisation={organisationWithManyAgents}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("100 Agents.")).toBeInTheDocument();
  });

  it("should be accessible with proper role and click handling", () => {
    render(
      <OrganisationCard organisation={mockOrganisation} onClick={mockOnClick} />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
  });
});
