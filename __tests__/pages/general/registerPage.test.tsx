import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../../../app/routes/general/registerPage";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock the dependencies
jest.mock("store/auth.context", () => ({
  useAuthContext: jest.fn(() => ({
    register: jest.fn(),
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
  default: ({
    buttonText,
    onPress,
    variant,
    className,
    fullWidth,
    isLoading,
    icon,
  }: any) => (
    <button
      onClick={onPress}
      className={className}
      disabled={isLoading}
      data-testid={`button-${buttonText?.toLowerCase().replace(/\s+/g, "-")}`}
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

describe("RegisterPage", () => {
  const mockRegister = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    const { useAuthContext } = require("store/auth.context");
    const { useNavigate } = require("react-router");

    useAuthContext.mockReturnValue({
      register: mockRegister,
      user: null,
      isAuthenticated: false,
    });

    useNavigate.mockReturnValue(mockNavigate);
  });

  it("should render registration form", () => {
    render(<RegisterPage />);

    expect(screen.getByText(/create your account/i)).toBeDefined();
    expect(
      screen.getByPlaceholderText(/johndoe@example\.com/i)
    ).toBeDefined();
    expect(screen.getByPlaceholderText(/password/i)).toBeDefined();
    expect(
      screen.getByPlaceholderText(/confirm password/i)
    ).toBeDefined();
    expect(screen.getByTestId("button-register")).toBeDefined();
  });

  it("should handle name input changes", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText(/full name/i);
    await user.type(nameInput, "John Doe");

    expect(nameInput).tohave("John Doe");
  });

  it("should handle email input changes", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const emailInput = screen.getByPlaceholderText(/johndoe@example\.com/i);
    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("should handle password input changes", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const passwordInput = screen.getByPlaceholderText(/password/i);
    await user.type(passwordInput, "password123");

    expect(passwordInput).toHaveValue("password123");
  });

  it("should handle confirm password input changes", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm password/i);
    await user.type(confirmPasswordInput, "password123");

    expect(confirmPasswordInput).toHaveValue("password123");
  });

  it("should toggle password visibility", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const passwordInput = screen.getByPlaceholderText(/password/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm password/i);
    const eyeIcons = screen.getAllByTestId("eye-off-icon");

    // Initially passwords should be hidden
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");

    // Click first eye icon to show password
    await user.click(eyeIcons[0]);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");

    // Click second eye icon to show confirm password
    await user.click(eyeIcons[1]);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(confirmPasswordInput).toHaveAttribute("type", "text");
  });

  it("should show validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const registerButton = screen.getByTestId("button-register");
    await user.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/confirm password is required/i)
      ).toBeInTheDocument();
    });
  });

  it("should show error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const emailInput = screen.getByPlaceholderText(/johndoe@example\.com/i);
    await user.type(emailInput, "invalid-email");

    const registerButton = screen.getByTestId("button-register");
    await user.click(registerButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });

  it("should show error for password mismatch", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/johndoe@example\.com/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm password/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "differentpassword");

    const registerButton = screen.getByTestId("button-register");
    await user.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("should show error for weak password", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/johndoe@example\.com/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm password/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "123");
    await user.type(confirmPasswordInput, "123");

    const registerButton = screen.getByTestId("button-register");
    await user.click(registerButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 6 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("should render social registration buttons", () => {
    render(<RegisterPage />);

    expect(screen.getByTestId("button-google")).toBeInTheDocument();
    expect(screen.getByTestId("button-facebook")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<RegisterPage />);

    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/terms of use/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
  });

  it("should have correct form structure", () => {
    render(<RegisterPage />);

    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
  });

  it("should clear errors when user starts typing", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const registerButton = screen.getByTestId("button-register");
    await user.click(registerButton);

    // Should show error initially
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();

    // Start typing in name field
    const nameInput = screen.getByPlaceholderText(/full name/i);
    await user.type(nameInput, "John");

    // Error should be cleared
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
  });
});
