"use client";
import { useState } from "react";


interface UploadResult {
  key?: string;
  presignedUrl?: string;
  error?: string;
}

const MEDIA_SERVICE_URL = process.env.NEXT_PUBLIC_MEDIA_SERVICE_URL;

export function useMediaUploader(projectKey = "default_project") {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToMediaService = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    setError(null);

    try {
      console.log(
        "MEDIA_SERVICE_URL IN uploadToMediaService ",
        MEDIA_SERVICE_URL
      );
      console.log(file);

      const res = await fetch(`${MEDIA_SERVICE_URL}/files/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          projectKey,
        }),
      });

      console.log("Error:", res);

      const data = await res.json();
      if (!res.ok || !data.url || !data.key)
        setError(data.error || "Error generando URL prefirmada");

      // devolvemos la url prefirmada (S3) para usar con xhr
      setUploading(false);
      return {
        key: data.key,
        presignedUrl: data.url,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
      setUploading(false);
      return { error: message };
    }
  };

  const deleteFromMediaService = async (key: string) => {
    setError(null);
    try {
      const res = await fetch(
        `${MEDIA_SERVICE_URL}/files/${encodeURIComponent(
          key
        )}?projectKey=${projectKey}`, // <-- enviamos projectKey
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Error eliminando imagen");
        return {
          success: false,
          error: data.error || "Error eliminando imagen",
        };
      }
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setError(message);
      return { success: false, error: message };
    }
  };

  return { uploadToMediaService, deleteFromMediaService, uploading, error };
}
