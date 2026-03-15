import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "bg-violet-600 text-white hover:bg-violet-500 shadow-sm",
  secondary:
    "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
  danger:
    "bg-red-600 text-white hover:bg-red-500",
  ghost:
    "bg-slate-100 text-slate-700 hover:bg-slate-200",
};

export default function Button({
  children,
  isLoading,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}