"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Button, Select, Textarea, CodeEditor } from "@/components/ui";
import { createReview, ApiError } from "@/lib";
import { LANGUAGES, type Language } from "@/types";

const defaultCode = `function calculateTotal(items) {
  let total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
}`;

export default function ReviewPage() {
  const router = useRouter();

  /* ── Form state ── */
  const [language, setLanguage] = useState<Language>("typescript");
  const [code, setCode] = useState(defaultCode);
  const [context, setContext] = useState("");

  /* ── UI state ── */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Validation ── */
  const [errors, setErrors] = useState<{ language?: string; code?: string }>(
    {},
  );

  function validate(): boolean {
    const next: typeof errors = {};

    if (!language) {
      next.language = "Selecione uma linguagem.";
    }

    if (!code.trim()) {
      next.code = "Cole ou escreva o código para review.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  /* ── Submit ── */
  async function handleSubmit() {
    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { id } = await createReview({
        language,
        code,
        context: context.trim() || undefined,
      });
      router.push(`/result/${id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado. Tente novamente.");
      }
      setIsSubmitting(false);
    }
  }

  const isValid = language && code.trim().length > 0;

  return (
    <>
      <Navbar />

      <main className="max-w-[800px] mx-auto px-6 py-16 flex flex-col gap-10">
        {/* ── Header ── */}
        <div className="text-center flex flex-col gap-3">
          <h1 className="text-3xl font-bold">
            <span className="text-text-secondary">$</span> new_review
          </h1>
          <p className="text-text-secondary text-sm font-body">
            {"// cole seu código, selecione a linguagem e receba um review completo"}
          </p>
        </div>

        {/* ── Form ── */}
        <div
          className={`flex flex-col gap-6 transition-opacity ${
            isSubmitting ? "opacity-40 pointer-events-none" : ""
          }`}
        >
          {/* Language select */}
          <Select
            label="linguagem"
            options={[...LANGUAGES]}
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as Language);
              setErrors((prev) => ({ ...prev, language: undefined }));
            }}
            error={errors.language}
          />

          {/* Code editor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-text-secondary">código</label>
            <CodeEditor
              value={code}
              onChange={(val) => {
                setCode(val);
                setErrors((prev) => ({ ...prev, code: undefined }));
              }}
              language={language}
              height="280px"
            />
            {errors.code && (
              <span className="text-xs text-severity-high">{errors.code}</span>
            )}
          </div>

          {/* Context textarea */}
          <Textarea
            label="contexto (opcional)"
            placeholder="// ex: função para calcular total de um carrinho de compras..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={3}
            className="min-h-[80px]"
          />
        </div>

        {/* ── Error message ── */}
        {error && (
          <div className="bg-severity-high/10 border border-severity-high/30 rounded-md px-4 py-3 text-sm text-severity-high">
            {error}
          </div>
        )}

        {/* ── Submit button ── */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !isValid}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "analisando..." : "revisar_codigo"}
          </Button>
        </div>
      </main>
    </>
  );
}
