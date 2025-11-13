import type { Business, Product, Review } from "@/app/generated/prisma";
import type { AnswerDTO } from "../answer/answer.dto";
import type { ReportedReviewDTO } from "../reported/reported-review.dto";
import type { ReviewImageDTO } from "./review-image.dto";

export interface ReviewDTO extends Review {
  product: Product;
  business: Business;
  answer: AnswerDTO;
  images: ReviewImageDTO[];
  reports: ReportedReviewDTO[];
}
