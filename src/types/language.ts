/* ── Supported languages ── */
export const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
] as const;

export type Language = (typeof LANGUAGES)[number]["value"];
