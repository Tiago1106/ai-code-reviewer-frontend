"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar, Badge, CodeBlock, ScoreDonut } from "@/components/ui";
import { LoadingState, ErrorState } from "@/components/states";
import { getReview, ApiError } from "@/lib";
import type { ReviewResult } from "@/types";

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */
function SectionTitle({
  children,
  count,
}: {
  children: string;
  count?: number;
}) {
  return (
    <h2 className="text-sm text-text-secondary font-bold mb-4">
      {"// "}
      {children}
      {count !== undefined && (
        <span className="text-text-tertiary"> [{count}]</span>
      )}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  Card wrapper                                                       */
/* ------------------------------------------------------------------ */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-lg px-6 py-5 flex flex-col gap-3">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section renderers                                                  */
/* ------------------------------------------------------------------ */
function SummarySection({ summary }: { summary: string }) {
  return (
    <section>
      <SectionTitle>summary</SectionTitle>
      <Card>
        <p className="text-sm font-body text-text-primary leading-relaxed">
          {summary}
        </p>
      </Card>
    </section>
  );
}

function PositivesSection({
  positives,
}: {
  positives: ReviewResult["positives"];
}) {
  if (positives.length === 0) return null;

  return (
    <section>
      <SectionTitle>positives</SectionTitle>
      <div className="flex flex-col gap-3">
        {positives.map((item, i) => (
          <Card key={i}>
            <h3 className="text-sm font-bold">
              <span className="text-accent-primary">[+]</span> {item.title}
            </h3>
            <p className="text-sm font-body text-text-secondary leading-relaxed">
              {item.explanation}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function IssuesSection({ issues }: { issues: ReviewResult["issues"] }) {
  if (issues.length === 0) return null;

  return (
    <section>
      <SectionTitle count={issues.length}>issues</SectionTitle>
      <div className="flex flex-col gap-4">
        {issues.map((issue, i) => (
          <Card key={i}>
            {/* Badges */}
            <div className="flex items-center gap-2">
              <Badge severity={issue.severity} />
              <Badge category={issue.category} />
            </div>

            {/* Title + explanation */}
            <h3 className="text-sm font-bold text-text-primary">
              {issue.title}
            </h3>
            <p className="text-sm font-body text-text-secondary leading-relaxed">
              {issue.explanation}
            </p>

            {/* Recommendation */}
            <p className="text-sm font-body text-text-secondary leading-relaxed">
              <span className="text-accent-primary font-bold">
                {">> "}
              </span>
              {issue.recommendation}
            </p>

            {/* Diff */}
            {issue.diff && (
              <CodeBlock code={issue.diff} diff maxHeight={200} />
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}

function SuggestionsSection({
  suggestions,
}: {
  suggestions: ReviewResult["suggestions"];
}) {
  if (suggestions.length === 0) return null;

  return (
    <section>
      <SectionTitle>suggestions</SectionTitle>
      <div className="flex flex-col gap-3">
        {suggestions.map((text, i) => (
          <Card key={i}>
            <p className="text-sm font-body text-text-secondary leading-relaxed">
              <span className="text-accent-primary font-bold">
                {">> "}
              </span>
              {text}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function QuestionsSection({
  questions,
}: {
  questions: ReviewResult["questions"];
}) {
  if (questions.length === 0) return null;

  return (
    <section>
      <SectionTitle>questions</SectionTitle>
      <div className="flex flex-col gap-3">
        {questions.map((text, i) => (
          <Card key={i}>
            <p className="text-sm font-body text-text-secondary leading-relaxed">
              <span className="text-severity-medium font-bold">? </span>
              {text}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["review", id],
    queryFn: () => getReview(id),
  });

  const result = data?.result;

  function getErrorMessage(): string {
    if (error instanceof ApiError && error.status === 404) {
      return "Review não encontrado. O ID pode ser inválido ou ter expirado.";
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Ocorreu um erro inesperado. Tente novamente.";
  }

  return (
    <>
      <Navbar />

      <main className="max-w-[960px] mx-auto px-6 sm:px-20 py-12 flex flex-col gap-10">
        {isLoading && (
          <LoadingState
            title="carregando_review..."
            description="Buscando o resultado da análise."
          />
        )}

        {isError && (
          <ErrorState
            message={getErrorMessage()}
            onRetry={() => refetch()}
            linkHref="/review"
          />
        )}

        {result && (
          <>
            {/* -- Header -- */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">
                  <span className="text-text-secondary">$</span> review_result
                </h1>
                <p className="text-sm font-body text-text-secondary">
                  {"// "}linguagem:{" "}
                  <span className="text-text-primary">typescript</span>
                  {" · "}status:{" "}
                  <span className="text-severity-low">done</span>
                </p>
              </div>
              <ScoreDonut score={result.overallScore} />
            </div>

            {/* -- Sections -- */}
            <SummarySection summary={result.summary} />
            <PositivesSection positives={result.positives} />
            <IssuesSection issues={result.issues} />
            <SuggestionsSection suggestions={result.suggestions} />
            <QuestionsSection questions={result.questions} />
          </>
        )}
      </main>
    </>
  );
}
