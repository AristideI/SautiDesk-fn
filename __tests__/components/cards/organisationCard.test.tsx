import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrganisationCard from "../../../components/cards/organisationCard";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock the dependencies
jest.mock("lucide-react", () => ({
  Boxes: () => <div data-testid="boxes-icon">📦</div>,
}));

describe("OrganisationCard", () => {
  const mockOrganisation = {
    id: "1",
    documentId: "org123",
    name: "Test Organisation",
    description: "A test organisation",
    agents: [
      { id: "1", name: "Agent 1" },
      { id: "2", name: "Agent 2" },
    ],
    createdAt: "2024-01-01",
    industry: "Test Industry",
    updatedAt: new Date(),
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render organisation name and agent count", () => {
    render(
      <OrganisationCard
        organisation={mockOrganisation as any}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("Test Organisation")).toBeDefined();
    expect(screen.getByText("2 Agents.")).toBeDefined();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    render(
      <OrganisationCard
        organisation={mockOrganisation as any}
        onClick={mockOnClick}
      />
    );

    const card = screen.getByRole("button");
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
