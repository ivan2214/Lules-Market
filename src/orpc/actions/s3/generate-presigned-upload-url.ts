"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ORPCError } from "@orpc/server";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "@/lib/s3";
import { actionContext, oa } from "@/orpc/middlewares";
import { BUCKET_NAME } from "@/shared/constants/s3";
import { GeneratePresignedUrlInputSchema } from "@/shared/validators/s3";

export const generatePresignedUploadUrl = oa
  .input(GeneratePresignedUrlInputSchema)
  .handler(async ({ input }) => {
    const { filename, contentType, size, folder } = input;

    // Validaciones
    if (size > 10 * 1024 * 1024) {
      // 10MB
      throw new ORPCError("El archivo es demasiado grande. Máximo 10MB.");
    }

    if (!contentType.startsWith("image/")) {
      throw new ORPCError("Solo se permiten imágenes.");
    }

    // Generar key único
    const fileExtension = filename.split(".").pop();
    const key = `${folder}/${uuidv4()}.${fileExtension}`;

    try {
      // Crear comando para subir archivo
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      });

      // Generar URL firmada
      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600, // 1 hora
      });

      return {
        presignedUrl,
        key,
      };
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      throw new ORPCError("Error al generar URL de subida");
    }
  })
  .actionable({
    context: actionContext,
  });
