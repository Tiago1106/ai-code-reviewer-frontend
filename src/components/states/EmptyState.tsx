import Link from "next/link";

type EmptyStateProps = {
  /** Title (default: "nenhum resultado") */
  title?: string;
  /** Description message */
  description?: string;
  /** Optional link to navigate away */
  linkHref?: string;
  /** Label for the link (default: "novo_review") */
  linkLabel?: string;
};

export function EmptyState({
  title = "nenhum_resultado",
  description = "Não há dados para exibir.",
  linkHref,
  linkLabel = "novo_review",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-20">
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-xl font-bold text-text-primary">
          <span className="text-text-secondary">$</span> {title}
        </h2>
        <p className="text-sm font-body text-text-secondary max-w-md">
          {description}
        </p>
      </div>

      {linkHref && (
        <Link
          href={linkHref}
          className="px-4 py-2 text-sm font-bold bg-accent-primary text-text-primary rounded-md hover:opacity-90 transition-opacity"
        >
          $ {linkLabel}
        </Link>
      )}
    </div>
  );
}
