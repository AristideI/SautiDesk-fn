interface ButtonProps {
  onPress: () => void;
  buttonText: string;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  icon?: React.ReactNode;
}

export default function Button({
  onPress,
  buttonText,
  disabled = false,
  className = "",
  variant = "primary",
  icon,
}: ButtonProps) {
  const baseStyles =
    "px-6 py-2 rounded-lg focus:outline-none font-semibold transition-all duration-300 cursor-pointer";
  const variantStyles = {
    primary: "bg-green hover:bg-green-hover text-white",
    secondary: "bg-dark-green hover:bg-dark-green/80 text-white text-white",
    tertiary:
      "bg-black hover:bg-dark-green text-dark-green text-dark-green text-white",
    quaternary:
      "border-dark-green border text-dark-green hover:bg-dark-green/20",
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {buttonText}
    </button>
  );
}
