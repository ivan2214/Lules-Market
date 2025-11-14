import type { Business, Product, Review } from "@/app/generated/prisma";
import type { AnswerDTO } from "../answer/answer.dto";

export interface ReviewDTO extends Review {
  product?: Product;
  business?: Business;
  answer?: AnswerDTO;
}
