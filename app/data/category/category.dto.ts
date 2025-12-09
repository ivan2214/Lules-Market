import type { BusinessDTO } from "@/app/data/business/business.dto";
import type { ProductDTO } from "@/app/data/product/product.dto";
import type { Category } from "@/db";

export interface CategoryDTO extends Category {
  products?: ProductDTO[] | null;
  businesses?: BusinessDTO[] | null;
}
