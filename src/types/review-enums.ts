/* ── Severity levels ── */
export const SEVERITIES = ["low", "medium", "high", "critical"] as const;
export type Severity = (typeof SEVERITIES)[number];

/* ── Issue categories ── */
export const CATEGORIES = ["quality", "security", "performance"] as const;
export type Category = (typeof CATEGORIES)[number];
