import type { Review } from "@/app/generated/prisma/client";
import type { BusinessDTO } from "../business/business.dto";
import type { ProductDTO } from "../product/product.dto";
import type { ProfileDTO } from "../profile/profile.dto";

export interface ReviewDTO extends Review {
  product?: ProductDTO | null;
  business?: BusinessDTO | null;
  author: ProfileDTO;
}
