import type { BusinessDTO } from "@/app/data/business/business.dto";
import type { ProductDTO } from "@/app/data/product/product.dto";
import type { SubCategoryDTO } from "@/app/data/sub-category/sub-category.dto";
import type { Category as CategoryPrisma } from "@/app/generated/prisma";

export interface CategoryDTO extends CategoryPrisma {
  products?: ProductDTO[] | null;
  businesses?: BusinessDTO[] | null;
  subCategories?: SubCategoryDTO[] | null;
}
