import type { Review, ReviewImage } from "@/app/generated/prisma";

export interface ReviewImageDTO extends ReviewImage {
  review: Review;
}
