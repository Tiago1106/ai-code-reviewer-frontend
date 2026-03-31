import Link from "next/link";
import { Navbar, Button, CodeBlock, Badge, ScoreDonut } from "@/components/ui";

/* ── Sample code for hero preview ── */
const heroCode = `import { Detail } from '@raycast/api';

export default function Command() {
  return <Detail markdown="Hello World" />;
}`;

/* ── Sample diff for result preview ── */
const previewDiff = `- const query = req.body.query;
+ const query = sanitize(req.body.query);`;

/* ── Feature cards data ── */
const features = [
  {
    icon: "[>]",
    title: "review_estruturado",
    description:
      "Issues categorizadas por severidade, sugestões de melhoria e perguntas para reflexão.",
  },
  {
    icon: "[+/-]",
    title: "diffs_estilo_pr",
    description:
      "Veja como corrigir cada issue com diffs claros, no estilo de Pull Request do GitHub.",
  },
  {
    icon: "[5]",
    title: "multi_linguagem",
    description:
      "Suporte a JavaScript, TypeScript, Python, Go e Java. Mais linguagens em breve.",
  },
] as const;

/* ── Score for donut chart ── */
const SCORE = 6;

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* ══════════════════════════════════════════
            Hero Section
            ══════════════════════════════════════════ */}
        <section className="px-20 py-20 flex items-center justify-between gap-16">
          {/* Left content */}
          <div className="flex flex-col gap-8 max-w-[700px]">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
              <span className="text-xs text-accent-primary font-medium">
                {"// ai-powered code review"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold leading-tight whitespace-pre">
              {"$ review your code\n   with ai precision"}
            </h1>

            {/* Description */}
            <p className="text-text-secondary font-body text-sm leading-relaxed max-w-[560px]">
              Cole seu código, selecione a linguagem e receba um review
              estruturado com issues, sugestões e diffs no estilo de PR.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/review">
                <Button variant="primary">start_review</Button>
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md bg-bg-elevated text-text-primary hover:bg-bg-surface transition-colors"
              >
                <span className="text-text-secondary">{"//"}</span>
                <span>learn_more</span>
              </a>
            </div>
          </div>

          {/* Right code preview */}
          <div className="w-[520px] flex-shrink-0">
            <CodeBlock code={heroCode} language="typescript" />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            Feature Cards Section
            ══════════════════════════════════════════ */}
        <section className="px-20 py-16">
          <div className="grid grid-cols-3 gap-10">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border border-border rounded-lg p-6 flex flex-col gap-4 hover:border-accent-primary/40 transition-colors"
              >
                {/* Icon */}
                <span className="text-accent-primary text-lg font-bold">
                  {feature.icon}
                </span>

                {/* Title */}
                <h3 className="text-text-secondary text-sm">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-text-tertiary text-xs font-body leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            Preview / CTA Section
            ══════════════════════════════════════════ */}
        <section
          id="como-funciona"
          className="px-20 py-16 flex flex-col items-center gap-10"
        >
          {/* Section header */}
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-text-secondary">
              {"// veja como funciona"}
            </h2>
            <p className="text-text-tertiary text-sm font-body">
              Um exemplo real de resultado de code review
            </p>
          </div>

          {/* Result preview card */}
          <div className="w-full max-w-[960px] bg-bg-surface rounded-lg border border-border overflow-hidden">
            {/* Card header */}
            <div className="flex items-start justify-between px-8 pt-8 pb-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">
                  <span className="text-text-secondary">$</span>{" "}
                  review_result
                </h3>
                <p className="text-text-tertiary text-xs">
                  {"// linguagem: typescript | score: 6/10"}
                </p>
              </div>

              {/* Score donut */}
              <ScoreDonut score={SCORE} />
            </div>

            {/* Issue preview */}
            <div className="px-8 pb-8 flex flex-col gap-4">
              {/* Badges */}
              <div className="flex items-center gap-3">
                <Badge severity="high" />
                <Badge category="security" />
              </div>

              {/* Issue title */}
              <h4 className="text-sm font-bold">Input não sanitizado</h4>

              {/* Issue description */}
              <p className="text-text-secondary text-xs font-body leading-relaxed">
                Dados de entrada devem ser validados antes de processamento.
              </p>

              {/* Recommendation */}
              <p className="text-text-tertiary text-xs font-body">
                <span className="text-accent-primary">{">>"}</span>{" "}
                Valide e sanitize inputs usando uma biblioteca apropriada.
              </p>

              {/* Diff preview */}
              <CodeBlock code={previewDiff} diff />
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/review">
            <Button variant="primary">testar agora</Button>
          </Link>
        </section>
      </main>
    </>
  );
}
