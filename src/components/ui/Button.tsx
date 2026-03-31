import { type ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-accent-primary text-text-primary hover:bg-accent-primary/80",
    secondary:
      "bg-bg-primary text-text-primary border border-border hover:bg-bg-elevated",
  };

  return (
    <button
      className={twMerge(base, variants[variant], className)}
      disabled={disabled}
      {...props}
    >
      <span className="text-text-secondary">$</span>
      <span>{children}</span>
    </button>
  );
}
