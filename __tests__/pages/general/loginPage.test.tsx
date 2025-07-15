import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../../../app/routes/general/loginPage";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock the dependencies
jest.mock("store/auth.context", () => ({
  useAuthContext: jest.fn(() => ({
    login: jest.fn(),
    user: null,
    isAuthenticated: false,
  })),
}));

jest.mock("react-router", () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: jest.fn(() => jest.fn()),
}));

jest.mock("react-hot-toast", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("components/utils/button", () => ({
  default: ({ buttonText, onPress, className, isLoading, icon }: any) => (
    <button
      onClick={onPress}
      className={className}
      disabled={isLoading}
      data-testid={`button-${buttonText?.toLowerCase()}`}
    >
      {icon}
      {buttonText}
    </button>
  ),
}));

jest.mock("components/utils/logo", () => ({
  default: () => <div data-testid="logo">Logo</div>,
}));

jest.mock("lucide-react", () => ({
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
}));

describe("LoginPage", () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    const { useAuthContext } = require("store/auth.context");
    const { useNavigate } = require("react-router");

    useAuthContext.mockReturnValue({
      login: mockLogin,
      user: null,
      isAuthenticated: false,
    });

    useNavigate.mockReturnValue(mockNavigate);
  });

  it("should render login form", () => {
    render(<LoginPage />);

    expect(screen.getByText("Login to your account")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("johndoe@example.com")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByTestId("button-login")).toBeInTheDocument();
  });

  it("should show validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const loginButton = screen.getByTestId("button-login");
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("should handle email input changes", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("johndoe@example.com");
    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("should handle password input changes", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText("Password");
    await user.type(passwordInput, "password123");

    expect(passwordInput).toHaveValue("password123");
  });

  it("should toggle password visibility", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText("Password");
    const eyeIcon = screen.getByTestId("eye-off-icon");

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click eye icon to show password
    await user.click(eyeIcon);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click again to hide password
    await user.click(eyeIcon);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should clear email error when user starts typing", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const loginButton = screen.getByTestId("button-login");
    await user.click(loginButton);

    // Should show error initially
    expect(screen.getByText("Email is required")).toBeInTheDocument();

    // Start typing in email field
    const emailInput = screen.getByPlaceholderText("johndoe@example.com");
    await user.type(emailInput, "test");

    // Error should be cleared
    expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
  });

  it("should clear password error when user starts typing", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const loginButton = screen.getByTestId("button-login");
    await user.click(loginButton);

    // Should show error initially
    expect(screen.getByText("Password is required")).toBeInTheDocument();

    // Start typing in password field
    const passwordInput = screen.getByPlaceholderText("Password");
    await user.type(passwordInput, "test");

    // Error should be cleared
    expect(screen.queryByText("Password is required")).not.toBeInTheDocument();
  });

  it("should render social login buttons", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("button-google")).toBeInTheDocument();
    expect(screen.getByTestId("button-facebook")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<LoginPage />);

    expect(screen.getByText("Go to create")).toBeInTheDocument();
    expect(screen.getByText("Forgot password")).toBeInTheDocument();
    expect(screen.getByText("Terms of use")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("should have correct form structure", () => {
    render(<LoginPage />);

    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute(
      "class",
      expect.stringContaining("flex flex-col gap-4 w-full")
    );
  });
});
