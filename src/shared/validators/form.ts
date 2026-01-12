import { Value } from "@sinclair/typebox/value";
import type { TSchema } from "elysia";

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
