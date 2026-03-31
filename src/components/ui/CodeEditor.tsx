"use client";

import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { go } from "@codemirror/lang-go";
import { java } from "@codemirror/lang-java";
import { tags as t } from "@lezer/highlight";
import type { Extension } from "@codemirror/state";

/* ── Types ── */
type Language = "javascript" | "typescript" | "python" | "go" | "java";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: Language;
  placeholder?: string;
  height?: string;
  readOnly?: boolean;
  disabled?: boolean;
};

/* ── Custom theme matching our design tokens ── */
const editorTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#1E1B2E",
    foreground: "#FAFAFA",
    caret: "#8B5CF6",
    selection: "#8B5CF626",
    selectionMatch: "#8B5CF615",
    lineHighlight: "#FAFAFA08",
    gutterBackground: "#1E1B2E",
    gutterForeground: "#6B6B6B",
    gutterBorder: "transparent",
    fontFamily:
      "var(--font-jetbrains-mono), JetBrains Mono, monospace",
  },
  styles: [
    { tag: [t.keyword, t.operatorKeyword, t.modifier, t.controlKeyword], color: "#C678DD" },
    { tag: [t.string, t.special(t.string), t.regexp], color: "#98C379" },
    { tag: [t.typeName, t.className, t.function(t.variableName), t.function(t.definition(t.variableName))], color: "#61AFEF" },
    { tag: [t.variableName, t.propertyName, t.attributeName], color: "#D19A66" },
    { tag: [t.number, t.bool], color: "#D19A66" },
    { tag: [t.punctuation, t.bracket, t.separator], color: "#6B6B6B" },
    { tag: [t.comment, t.lineComment, t.blockComment], color: "#6B6B6B" },
    { tag: t.operator, color: "#FAFAFA" },
    { tag: t.definition(t.variableName), color: "#61AFEF" },
  ],
});

/* ── Language extensions map ── */
const languageExtensions: Record<Language, () => Extension> = {
  javascript: () => javascript({ jsx: true }),
  typescript: () => javascript({ jsx: true, typescript: true }),
  python: () => python(),
  go: () => go(),
  java: () => java(),
};

/* ── Component ── */
export function CodeEditor({
  value,
  onChange,
  language,
  placeholder = "cole seu codigo aqui...",
  height = "300px",
  readOnly = false,
  disabled = false,
}: CodeEditorProps) {
  const extensions = useMemo(() => {
    if (!language) return [];
    const factory = languageExtensions[language];
    return factory ? [factory()] : [];
  }, [language]);

  return (
    <div
      className={`rounded-lg border border-border overflow-hidden ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      <CodeMirror
        value={value}
        onChange={onChange}
        height={height}
        theme={editorTheme}
        extensions={extensions}
        placeholder={placeholder}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          bracketMatching: true,
          closeBrackets: true,
          indentOnInput: true,
          autocompletion: false,
          foldGutter: false,
          searchKeymap: false,
          tabSize: 2,
        }}
      />
    </div>
  );
}
