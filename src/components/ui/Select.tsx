import { type SelectHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
};

export function Select({
  options,
  placeholder = "selecionar...",
  label,
  error,
  id,
  className,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm text-text-secondary">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={twMerge(
          "appearance-none bg-bg-surface text-text-primary text-sm border border-border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          error && "border-severity-high",
          className
        )}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-severity-high">{error}</span>
      )}
    </div>
  );
}
