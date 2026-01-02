"use server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { image as imageSchema } from "@/db/schema";
import { s3Client } from "@/lib/s3";
import { actionContext, oa } from "@/orpc/middlewares";
import { BUCKET_NAME } from "@/shared/constants/s3";
import { DeleteS3ObjectInputSchema } from "@/shared/validators/s3";

export const deleteS3Object = oa
  .input(DeleteS3ObjectInputSchema)
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    const { key } = input;
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);

      await db.delete(imageSchema).where(eq(imageSchema.key, key));

      return { success: true };
    } catch (error) {
      console.error("Error deleting S3 object:", error);
      return { success: false };
    }
  })
  .actionable({
    context: actionContext,
  });
