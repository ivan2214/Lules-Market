"use server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { s3Client } from "@/lib/s3";
import { BUCKET_NAME } from "@/shared/constants/s3";
import { DeleteS3ObjectInputSchema } from "./_validations";

export const deleteS3Object = os
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

      await db.delete(schema.image).where(eq(schema.image.key, key));

      return { success: true };
    } catch (error) {
      console.error("Error deleting S3 object:", error);
      return { success: false };
    }
  })
  .actionable();
