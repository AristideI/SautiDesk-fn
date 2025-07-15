import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../../../components/utils/button";

// Mock the LoadingSpinner component
jest.mock("../../../components/utils/loadings", () => ({
  LoadingSpinner: ({ isWhite }: { isWhite: boolean }) => (
    <div data-testid="loading-spinner" data-white={isWhite}>
      Loading...
    </div>
  ),
}));

describe("Button", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render button with text", () => {
    render(<Button onPress={mockOnPress} buttonText="Click me" />);

    expect(screen.getByText("Click me")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should call onPress when clicked", async () => {
    const user = userEvent.setup();
    render(<Button onPress={mockOnPress} buttonText="Click me" />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(
      <Button onPress={mockOnPress} buttonText="Click me" disabled={true} />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should be disabled when isLoading is true", () => {
    render(
      <Button onPress={mockOnPress} buttonText="Click me" isLoading={true} />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should show loading spinner when isLoading is true", () => {
    render(
      <Button onPress={mockOnPress} buttonText="Click me" isLoading={true} />
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should show loading spinner with correct color for primary variant", () => {
    render(
      <Button
        onPress={mockOnPress}
        buttonText="Click me"
        isLoading={true}
        variant="primary"
      />
    );

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toHaveAttribute("data-white", "true");
  });

  it("should show loading spinner with correct color for secondary variant", () => {
    render(
      <Button
        onPress={mockOnPress}
        buttonText="Click me"
        isLoading={true}
        variant="secondary"
      />
    );

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toHaveAttribute("data-white", "false");
  });

  it("should render icon when provided", () => {
    const icon = <span data-testid="test-icon">🚀</span>;
    render(<Button onPress={mockOnPress} buttonText="Click me" icon={icon} />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("🚀")).toBeInTheDocument();
  });

  it("should have primary variant styles by default", () => {
    render(<Button onPress={mockOnPress} buttonText="Click me" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-green/50",
      "border",
      "border-green",
      "hover:bg-green-hover",
      "text-white"
    );
  });

  it("should have secondary variant styles when specified", () => {
    render(
      <Button onPress={mockOnPress} buttonText="Click me" variant="secondary" />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "border-green",
      "border",
      "text-green",
      "hover:bg-dark-green/20"
    );
  });

  it("should have full width when fullWidth prop is true", () => {
    render(
      <Button onPress={mockOnPress} buttonText="Click me" fullWidth={true} />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full");
  });

  it("should apply custom className", () => {
    render(
      <Button
        onPress={mockOnPress}
        buttonText="Click me"
        className="custom-class"
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should have correct id when provided", () => {
    render(
      <Button onPress={mockOnPress} buttonText="Click me" id="test-button" />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("id", "test-button");
  });

  it("should have base styles", () => {
    render(<Button onPress={mockOnPress} buttonText="Click me" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "px-6",
      "py-2",
      "flex",
      "gap-2",
      "text-sm",
      "justify-center",
      "items-center",
      "rounded-lg",
      "focus:outline-none",
      "transition-all",
      "duration-300",
      "cursor-pointer"
    );
  });

  it("should not call onPress when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Button onPress={mockOnPress} buttonText="Click me" disabled={true} />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("should not call onPress when loading", async () => {
    const user = userEvent.setup();
    render(
      <Button onPress={mockOnPress} buttonText="Click me" isLoading={true} />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("should render without buttonText", () => {
    render(<Button onPress={mockOnPress} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("");
  });

  it("should render with only icon and no text", () => {
    const icon = <span data-testid="test-icon">🚀</span>;
    render(<Button onPress={mockOnPress} icon={icon} />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("🚀")).toBeInTheDocument();
  });
});
