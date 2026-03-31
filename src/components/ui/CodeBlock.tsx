"use client";

import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";

/* ── Register only the languages we support ── */
hljs.registerLanguage("javascript", typescript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("go", go);
hljs.registerLanguage("java", java);

/* ── Types ── */
type Language = "javascript" | "typescript" | "python" | "go" | "java";

type CodeBlockProps = {
  code: string;
  language?: Language;
  showLineNumbers?: boolean;
  maxHeight?: number;
  maxLines?: number;
  maxLength?: number;
  diff?: boolean;
};

/* ── Diff helpers ── */
type DiffLineType = "add" | "remove" | "context";

function parseDiffLine(raw: string): { type: DiffLineType; content: string } {
  if (raw.startsWith("+")) return { type: "add", content: raw };
  if (raw.startsWith("-")) return { type: "remove", content: raw };
  return { type: "context", content: raw };
}

const diffLineStyles: Record<DiffLineType, string> = {
  add: "bg-diff-add-bg text-diff-add-text",
  remove: "bg-diff-remove-bg text-diff-remove-text",
  context: "",
};

/* ── Component ── */
export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  maxHeight,
  maxLines = 500,
  maxLength,
  diff = false,
}: CodeBlockProps) {
  /* Truncate by length */
  const truncatedCode = useMemo(() => {
    if (maxLength && code.length > maxLength) {
      return code.slice(0, maxLength) + "\n...";
    }
    return code;
  }, [code, maxLength]);

  /* Split into lines and truncate by line count */
  const lines = useMemo(() => {
    const allLines = truncatedCode.split("\n");
    if (allLines.length > maxLines) {
      return [...allLines.slice(0, maxLines), "..."];
    }
    return allLines;
  }, [truncatedCode, maxLines]);

  /* Syntax highlight (only in non-diff mode) */
  const highlightedLines = useMemo(() => {
    if (diff) {
      return lines.map((line) => {
        const { type, content } = parseDiffLine(line);
        return { type, html: escapeHtml(content) };
      });
    }

    if (!language) {
      return lines.map((line) => ({
        type: "context" as DiffLineType,
        html: escapeHtml(line),
      }));
    }

    try {
      const highlighted = hljs.highlight(truncatedCode, {
        language,
        ignoreIllegals: true,
      });
      return highlighted.value.split("\n").map((html) => ({
        type: "context" as DiffLineType,
        html,
      }));
    } catch {
      return lines.map((line) => ({
        type: "context" as DiffLineType,
        html: escapeHtml(line),
      }));
    }
  }, [lines, diff, language, truncatedCode]);

  return (
    <div
      className="bg-bg-codeblock rounded-lg border border-border overflow-hidden"
      style={maxHeight ? { maxHeight, overflow: "auto" } : undefined}
    >
      <div className="overflow-x-auto py-4">
        <table className="w-full border-collapse">
          <tbody>
            {highlightedLines.map((line, i) => (
              <tr key={i} className={diffLineStyles[line.type]}>
                {showLineNumbers && (
                  <td className="select-none text-right pr-4 pl-4 py-0 text-xs leading-6 text-text-tertiary w-[1%] whitespace-nowrap align-top">
                    {i + 1}
                  </td>
                )}
                <td
                  className="pr-4 py-0 text-sm leading-6 whitespace-pre font-mono"
                  dangerouslySetInnerHTML={{ __html: line.html || "&nbsp;" }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Util ── */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
