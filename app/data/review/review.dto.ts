import type { Business, Product, Review } from "@/app/generated/prisma";
import type { ProfileDTO } from "../profile/profile.dto";

export interface ReviewDTO extends Review {
  product?: Product | null;
  business?: Business | null;
  author: ProfileDTO;
}
