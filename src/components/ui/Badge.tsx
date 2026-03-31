import { twMerge } from "tailwind-merge";

type SeverityLevel = "low" | "medium" | "high" | "critical";
type CategoryType = "quality" | "security" | "performance";

type BadgeProps =
  | { severity: SeverityLevel; category?: never }
  | { category: CategoryType; severity?: never };

const severityStyles: Record<SeverityLevel, string> = {
  low: "bg-severity-low/15 text-severity-low",
  medium: "bg-severity-medium/15 text-severity-medium",
  high: "bg-severity-high/15 text-severity-high",
  critical: "bg-severity-critical/15 text-severity-critical",
};

const categoryStyles: Record<CategoryType, string> = {
  quality: "bg-bg-elevated text-text-secondary",
  security: "bg-bg-elevated text-text-secondary",
  performance: "bg-bg-elevated text-text-secondary",
};

export function Badge(props: BadgeProps) {
  const isSeverity = "severity" in props && props.severity !== undefined;
  const label = isSeverity ? props.severity : props.category!;
  const variantStyle = isSeverity
    ? severityStyles[props.severity!]
    : categoryStyles[props.category!];

  return (
    <span
      className={twMerge(
        "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium uppercase tracking-wider",
        variantStyle
      )}
    >
      {label}
    </span>
  );
}
