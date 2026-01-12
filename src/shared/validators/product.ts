import { Value } from "@sinclair/typebox/value";
import type { Static, TSchema } from "elysia";
import {
  ProductCreateBody,
  ProductUpdateBody,
} from "@/server/routers/products";

export type ProductCreateInput = Static<typeof ProductCreateBody>;
export type ProductUpdateInput = Static<typeof ProductUpdateBody>;

// Validator adapter for TanStack Form
export const typeboxValidator = <T extends TSchema>(schema: T) => {
  return ({ value }: { value: unknown }) => {
    try {
      if (Value.Check(schema, value)) return undefined;
      const errors = [...Value.Errors(schema, value)];
      if (errors.length === 0) return undefined;
      // Return the first error message or a joined string
      return errors.map((e) => e.message).join(", ");
    } catch (e) {
      console.error(e);
      return "Validation error";
    }
  };
};

export const ProductCreateSchema = typeboxValidator(ProductCreateBody);
export const ProductUpdateSchema = typeboxValidator(ProductUpdateBody);

// We need to export the schemas themselves too if needed for type inference elsewhere
export const ProductCreateSchemaObject = ProductCreateBody;
export const ProductUpdateSchemaObject = ProductUpdateBody;
