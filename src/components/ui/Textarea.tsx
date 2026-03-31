import { type TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({
  label,
  error,
  id,
  className,
  ...props
}: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={twMerge(
          "bg-bg-codeblock text-text-primary text-sm font-mono border border-border rounded-lg px-4 py-3 min-h-[200px] resize-y focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-primary placeholder:text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-severity-high",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-severity-high">{error}</span>
      )}
    </div>
  );
}
