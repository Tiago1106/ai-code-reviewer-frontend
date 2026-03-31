import type {
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewResponse,
} from "@/types";
import { request } from "./client";

/** POST /reviews — submit code for review */
export async function createReview(
  data: CreateReviewRequest,
): Promise<CreateReviewResponse> {
  return request<CreateReviewResponse>("/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** GET /reviews/:id — fetch review result */
export async function getReview(id: string): Promise<GetReviewResponse> {
  return request<GetReviewResponse>(`/reviews/${id}`);
}
