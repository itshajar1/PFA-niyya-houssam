// src/components/common/Button.tsx
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "default" | "icon"; // ✅ Added size prop
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "default",
  disabled = false,
  className = "",
  fullWidth = false,
  isLoading = false,
}: ButtonProps) {
  // Base styles
  const baseClasses = "font-medium transition-colors focus:outline-none rounded";

  // Variant styles
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  // Size styles
  const sizeClasses = {
    default: "px-4 py-2",
    icon: "w-9 h-9 p-0 flex items-center justify-center", // ~36px square
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled ? "opacity-50 cursor-not-allowed" : "",
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}