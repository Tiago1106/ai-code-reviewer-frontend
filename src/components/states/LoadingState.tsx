type LoadingStateProps = {
  /** Title shown below the spinner (default: "carregando...") */
  title?: string;
  /** Subtitle / description */
  description?: string;
};

export function LoadingState({
  title = "carregando...",
  description,
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-20">
      {/* Spinner */}
      <div className="w-10 h-10 border-3 border-border border-t-accent-primary rounded-full animate-spin" />

      <div className="text-center flex flex-col gap-2">
        <h2 className="text-lg font-bold text-text-primary">
          <span className="text-text-secondary">$</span> {title}
        </h2>
        {description && (
          <p className="text-sm font-body text-text-secondary max-w-md">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
