"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Navbar, Button, Select, Textarea, CodeEditor } from "@/components/ui";
import { createReview } from "@/lib";
import { LANGUAGES, type Language } from "@/types";
import type { CreateReviewRequest } from "@/types";

const defaultCode = `function calculateTotal(items) {
  let total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
}`;

export default function ReviewPage() {
  const router = useRouter();

  /* -- Form state -- */
  const [language, setLanguage] = useState<Language>("typescript");
  const [code, setCode] = useState(defaultCode);
  const [context, setContext] = useState("");

  /* -- Validation -- */
  const [errors, setErrors] = useState<{ language?: string; code?: string }>(
    {},
  );

  /* -- Mutation -- */
  const { mutate, isPending, error: mutationError } = useMutation({
    mutationFn: (data: CreateReviewRequest) => createReview(data),
    onSuccess: ({ id }) => {
      router.push(`/result/${id}`);
    },
  });

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

  /* -- Submit -- */
  function handleSubmit() {
    if (!validate()) return;

    mutate({
      language,
      code,
      context: context.trim() || undefined,
    });
  }

  const isValid = language && code.trim().length > 0;
  const errorMessage =
    mutationError instanceof Error ? mutationError.message : null;

  return (
    <>
      <Navbar />

      <main className="max-w-[800px] mx-auto px-6 py-16 flex flex-col gap-10">
        {/* -- Header -- */}
        <div className="text-center flex flex-col gap-3">
          <h1 className="text-3xl font-bold">
            <span className="text-text-secondary">$</span> new_review
          </h1>
          <p className="text-text-secondary text-sm font-body">
            {"// cole seu código, selecione a linguagem e receba um review completo"}
          </p>
        </div>

        {/* -- Form -- */}
        <div
          className={`flex flex-col gap-6 transition-opacity ${
            isPending ? "opacity-40 pointer-events-none" : ""
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

        {/* -- Error message -- */}
        {errorMessage && (
          <div className="bg-severity-high/10 border border-severity-high/30 rounded-md px-4 py-3 text-sm text-severity-high">
            {errorMessage}
          </div>
        )}

        {/* -- Submit button -- */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isPending || !isValid}
            aria-busy={isPending}
          >
            {isPending ? "analisando..." : "revisar_codigo"}
          </Button>
        </div>
      </main>
    </>
  );
}
