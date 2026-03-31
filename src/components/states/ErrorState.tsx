import Link from "next/link";

type ErrorStateProps = {
  /** Title shown above the message (default: "erro") */
  title?: string;
  /** Error message to display */
  message: string;
  /** Callback for the retry button. If omitted, retry button is hidden. */
  onRetry?: () => void;
  /** Label for the retry button (default: "tentar_novamente") */
  retryLabel?: string;
  /** Optional link to navigate away (e.g. "/review") */
  linkHref?: string;
  /** Label for the link (default: "novo_review") */
  linkLabel?: string;
};

export function ErrorState({
  title = "erro",
  message,
  onRetry,
  retryLabel = "tentar_novamente",
  linkHref,
  linkLabel = "novo_review",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-20">
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-xl font-bold text-text-primary">
          <span className="text-text-secondary">$</span> {title}
        </h2>
        <p className="text-sm font-body text-text-secondary max-w-md">
          {message}
        </p>
      </div>

      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm font-bold bg-accent-primary text-text-primary rounded-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            $ {retryLabel}
          </button>
        )}
        {linkHref && (
          <Link
            href={linkHref}
            className="px-4 py-2 text-sm font-bold bg-bg-primary border border-border text-text-primary rounded-md hover:bg-bg-elevated transition-colors"
          >
            $ {linkLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
