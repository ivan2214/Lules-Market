import { z } from "zod";

export const GeneratePresignedUrlInputSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z.number(),
  folder: z.string().optional().default("products"),
});

export const DeleteS3ObjectInputSchema = z.object({
  key: z.string(),
});
