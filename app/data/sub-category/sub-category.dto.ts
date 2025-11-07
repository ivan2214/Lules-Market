import type { BusinessDTO } from "@/app/data/business/business.dto";
import type { CategoryDTO } from "@/app/data/category/category.dto";
import type { ProductDTO } from "@/app/data/product/product.dto";
import type { SubCategory as SubCategoryPrisma } from "@/app/generated/prisma";

export interface SubCategoryDTO extends SubCategoryPrisma {
  products?: ProductDTO[] | null;
  businesses?: BusinessDTO[] | null;
  subCategories?: SubCategoryDTO[] | null;
  category: CategoryDTO;
}
