import { LoadingSpinner } from "./loadings";

interface ButtonProps {
  onPress: (e?: React.FormEvent) => void | Promise<void>;
  buttonText: string;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  id?: string;
}

export default function Button({
  onPress,
  buttonText,
  disabled = false,
  className = "",
  fullWidth = false,
  isLoading = false,
  variant = "primary",
  icon,
  id,
}: ButtonProps) {
  const baseStyles = `px-6 py-2 flex gap-2 text-sm justify-center items-center rounded-lg focus:outline-none transition-all duration-300 cursor-pointer ${
    fullWidth ? "w-full" : ""
  } `;

  const variantStyles = {
    primary: "bg-green/50 border border-green hover:bg-green-hover text-white",
    secondary: "border-green border text-green hover:bg-dark-green/20",
  };

  return (
    <button
      id={id}
      onClick={onPress}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {isLoading ? (
        <div>
          <LoadingSpinner isWhite={variant === "primary"} />
          <p className="h-0 opacity-0 ">{buttonText}</p>
        </div>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {buttonText}
        </>
      )}
    </button>
  );
}
