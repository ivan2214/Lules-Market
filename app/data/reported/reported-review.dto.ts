import type { ReportedReview, Review, User } from "@/app/generated/prisma";

export interface ReportedReviewDTO extends ReportedReview {
user:    User
review:  Review
}
