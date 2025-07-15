import { render, screen } from "@testing-library/react";
import Home from "../../../app/routes/general/homePage";
import { describe, it, expect, jest } from "@jest/globals";

// Mock the dependencies
jest.mock("store/auth.context", () => ({
  useAuthContext: jest.fn(() => ({
    user: null,
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
  })),
}));

jest.mock("components/hero.section", () => ({
  default: () => <div data-testid="hero-section">Hero Section</div>,
}));

describe("HomePage", () => {
  it("should render without crashing", () => {
    render(<Home />);
    expect(screen.getByTestId("hero-section")).toBeDefined();
  });

  it("should have correct article structure", () => {
    render(<Home />);
    const article = screen.getByRole("article");
    expect(article).toBeDefined();
    // expect(article).to("flex-1", "w-full", "min-h-screen");
  });

  it("should render HeroSection component", () => {
    render(<Home />);
    expect(screen.getByTestId("hero-section")).toBeDefined();
    expect(screen.getByText("Hero Section")).toBeDefined();
  });
});
