import { useState } from "react";
import { deleteS3Object } from "../../orpc/actions/s3/delete-s3-object";
import { generatePresignedUploadUrl } from "../../orpc/actions/s3/generate-presigned-upload-url";

interface UseS3UploaderResult {
  uploadToS3: (
    file: File,
  ) => Promise<{ key?: string; presignedUrl?: string; error?: string }>;
  deleteFromS3: (key: string) => Promise<{ success: boolean; error?: string }>;
  uploading: boolean;
  error: string | null;
}

export function useS3Uploader(folder: string): UseS3UploaderResult {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToS3 = async (
    file: File,
  ): Promise<{ key?: string; presignedUrl?: string; error?: string }> => {
    setUploading(true);
    setError(null);
    try {
      const { name: filename, type: contentType, size } = file;

      const [genError, genData] = await generatePresignedUploadUrl({
        filename,
        contentType,
        size,
        folder,
      });

      if (genError) {
        setError(genError.message || "Error al generar URL prefirmada");
        setUploading(false);
        return { error: genError.message || "Error al generar URL prefirmada" };
      }

      const { presignedUrl, key } = genData;

      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType,
        },
      });

      if (!uploadRes.ok) {
        setError("Error al subir la imagen a S3");
        setUploading(false);
        return { error: "Error al subir la imagen a S3" };
      }

      setUploading(false);
      return { key, presignedUrl };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setUploading(false);
      return { error: err instanceof Error ? err.message : "Error inesperado" };
    }
  };

  const deleteFromS3 = async (key: string) => {
    setError(null);
    try {
      const [delError, _delData] = await deleteS3Object({ key });

      if (delError) {
        setError(delError.message || "Error al eliminar la imagen de S3");
        return { success: false, error: delError.message };
      }

      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      return {
        success: false,
        error: err instanceof Error ? err.message : "Error inesperado",
      };
    }
  };

  return { uploadToS3, deleteFromS3, uploading, error };
}
