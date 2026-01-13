import { t } from "elysia";

export const ImageInputSchema = t.Object({
  isMainImage: t.Boolean(),
  file: t.Array(t.File(), { minItems: 1, error: "Upload at least one file." }),
  key: t.Optional(t.String()),
});
