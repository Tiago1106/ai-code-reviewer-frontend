import type { Language } from "./language";
import type { Severity, Category } from "./review-enums";

/** POST /reviews — request body */
export type CreateReviewRequest = {
  language: Language;
  code: string;
  context?: string;
};

/** POST /reviews — response */
export type CreateReviewResponse = {
  id: string;
};

/** GET /reviews/:id — response */
export type GetReviewResponse = {
  id: string;
  status: "done";
  result: ReviewResult;
};

/** Review result shape */
export type ReviewResult = {
  summary: string;
  positives: {
    title: string;
    explanation: string;
  }[];
  issues: {
    severity: Severity;
    category: Category;
    title: string;
    explanation: string;
    recommendation: string;
    diff?: string;
  }[];
  suggestions: string[];
  questions: string[];
  overallScore: number;
};
