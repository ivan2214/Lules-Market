import { z } from "zod";

export const ImageInputSchema = z.object({
  isMainImage: z.boolean(),
  file: z.array(z.instanceof(File)).min(1, "Upload at least one file."),
  key: z.string().optional(),
});
