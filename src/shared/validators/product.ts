import type { Static } from "elysia";
import {
  ProductCreateBody,
  ProductUpdateBody,
} from "@/server/routers/products";
import { typeboxValidator } from "@/shared/validators/form";

export type ProductCreateInput = Static<typeof ProductCreateBody>;
export type ProductUpdateInput = Static<typeof ProductUpdateBody>;

export const ProductCreateSchema = typeboxValidator(ProductCreateBody);
export const ProductUpdateSchema = typeboxValidator(ProductUpdateBody);

// We need to export the schemas themselves too if needed for type inference elsewhere
export const ProductCreateSchemaObject = ProductCreateBody;
export const ProductUpdateSchemaObject = ProductUpdateBody;
