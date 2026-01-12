import { t } from "elysia";

export const ImageInputSchema = t.Object({
  isMainImage: t.Boolean(),
  file: t.Array(t.File()).min(1, "Upload at least one file."),
  key: t.String().optional(),
});
