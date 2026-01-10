"use server";

import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { env } from "@/env/server";
import { actionContext, oa } from "@/orpc/middlewares";

export const uploadAccountImage = oa
  .input(
    z.object({
      file: z.instanceof(File),
      key: z.string().min(1),
      folder: z.string().min(1),
    }),
  )
  .output(z.string())
  .handler(async ({ input }) => {
    const { file, key } = input;

    try {
      const { name: filename, type: contentType, size } = file;
      console.log(filename, contentType, size);

      /* const [genError] = await generatePresignedUploadUrl({
        filename,
        contentType,
        size,
        folder,
      });

      if (genError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to generate presigned upload URL",
        });
      } */

      /* const { uploadUrl } = genData;

      const [uploadError] = await uploadToS3({
        uploadUrl,
        file,
      });

      if (uploadError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to upload image to S3",
        });
      }
 */
      return getImageUrl(key, env.S3_BUCKET_NAME);
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to upload image to S3",
      });
    }
  })
  .actionable({
    context: actionContext,
  });

function getImageUrl(key: string, bucketName: string): string {
  return `${env.S3_BUCKET_URL}/${bucketName}/${key}`;
}
