"use server";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { db, schema } from "@/db";
import { env } from "@/env";

const s3Client = new S3Client({
  region: env.AWS_REGION || "",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = env.S3_BUCKET_NAME || "";

const GeneratePresignedUrlInputSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z.number(),
  folder: z.string().optional().default("products"),
});

export const generatePresignedUploadUrl = os
  .input(GeneratePresignedUrlInputSchema)
  .handler(async ({ input }) => {
    const { filename, contentType, size, folder } = input;

    // Validaciones
    if (size > 10 * 1024 * 1024) {
      // 10MB
      throw new Error("El archivo es demasiado grande. Máximo 10MB.");
    }

    if (!contentType.startsWith("image/")) {
      throw new Error("Solo se permiten imágenes.");
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
      throw new Error("Error al generar URL de subida");
    }
  })
  .actionable();

const DeleteS3ObjectInputSchema = z.object({
  key: z.string(),
});

export const deleteS3Object = os
  .input(DeleteS3ObjectInputSchema)
  .handler(async ({ input }) => {
    const { key } = input;

    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);

      await db.delete(schema.image).where(eq(schema.image.key, key));

      revalidatePath("/dashboard");

      return { success: true };
    } catch (error) {
      console.error("Error deleting S3 object:", error);
      throw new Error("Error al eliminar archivo");
    }
  })
  .actionable();
