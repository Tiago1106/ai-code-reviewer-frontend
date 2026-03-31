"use client";

import { useState } from "react";
import {
  Button,
  Select,
  Textarea,
  Badge,
  Navbar,
  CodeBlock,
  CodeEditor,
} from "@/components/ui";

const sampleCode = `function calculateTotal(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}`;

const sampleDiff = `- file_get_contents(NEXMO_APPLICATION_PRIVATE_KEY_PATH),
- NEXMO_APPLICATION_ID
+ file_get_contents(VONAGE_APPLICATION_PRIVATE_KEY_PATH),
+ VONAGE_APPLICATION_ID
  // context line unchanged`;

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
];

type Language = "javascript" | "typescript" | "python" | "go" | "java";

export default function Home() {
  const [code, setCode] = useState(sampleCode);
  const [language, setLanguage] = useState<Language>("typescript");

  return (
    <>
      <Navbar />

      <main className="max-w-4xl mx-auto px-10 py-12 flex flex-col gap-12">
        <h1 className="text-2xl font-bold">{"// component_preview"}</h1>

        {/* Buttons */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg text-text-secondary">{"// buttons"}</h2>
          <div className="flex items-center gap-4">
            <Button>start_review</Button>
            <Button variant="secondary">cancel</Button>
            <Button disabled>analisando...</Button>
          </div>
        </section>

        {/* Badges */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg text-text-secondary">{"// badges"}</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge severity="low" />
            <Badge severity="medium" />
            <Badge severity="high" />
            <Badge severity="critical" />
            <Badge category="quality" />
            <Badge category="security" />
            <Badge category="performance" />
          </div>
        </section>

        {/* Select */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg text-text-secondary">{"// select"}</h2>
          <div className="max-w-xs">
            <Select
              label="linguagem"
              options={languages}
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            />
          </div>
        </section>

        {/* CodeEditor — interactive */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg text-text-secondary">{"// code_editor"}</h2>
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            height="250px"
          />
        </section>

        {/* Textarea */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg text-text-secondary">{"// textarea"}</h2>
          <Textarea
            label="contexto (opcional)"
            placeholder="descreva o contexto do codigo..."
            rows={4}
          />
        </section>

        {/* CodeBlock — read-only syntax highlight */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg text-text-secondary">{"// codeblock (read-only)"}</h2>
          <CodeBlock code={sampleCode} language="typescript" />
        </section>

        {/* CodeBlock — diff mode */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg text-text-secondary">{"// codeblock (diff)"}</h2>
          <CodeBlock code={sampleDiff} diff />
        </section>
      </main>
    </>
  );
}
