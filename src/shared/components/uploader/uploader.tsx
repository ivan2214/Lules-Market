"use client";

import { useCallback, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import type { ImageInsert } from "@/db/types";
import { useS3Uploader } from "@/shared/hooks/use-s3-uploader";
import { canUploadMoreFiles, isValueArray } from "./uploader.helpers";
// Tipos y helpers extraídos a módulos separados para modularidad.
import type { UploaderProps } from "./uploader.types";
import {
  AvatarVariant,
  DefaultVariant,
  MinimalVariant,
} from "./uploader.variants";

export function Uploader({
  variant = "default",
  maxFiles = 5,
  maxSize = 10,
  accept = ["image/*"],
  preview = "list",
  onChange,
  value,
  disabled = false,
  className,
  placeholder,
  folder,
  id,
}: UploaderProps) {
  const [uploading, setUploading] = useState<{
    isLoading: boolean;
    isDeleting: boolean;
  }>({
    isLoading: false,
    isDeleting: false,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const { uploadToS3, deleteFromS3 } = useS3Uploader(folder);

  // Guards y helpers provistos por ./uploader.helpers

  const handleMainImage = useCallback(
    (key: string) => {
      if (isValueArray(value)) {
        const oldMainImage = value.find((file) => file.isMainImage);
        if (oldMainImage) {
          oldMainImage.isMainImage = false;
        }
        const newMainImage = value.find((file) => file.key === key);
        if (newMainImage) {
          newMainImage.isMainImage = true;
        }
        // actualizar el estado con las nuevas imagenes con isMainImage actualizado
        onChange(value);
      }
    },
    [value, onChange],
  );

  const uploadFile = useCallback(
    async (file: File, isMainImage: boolean): Promise<ImageInsert | null> => {
      try {
        const { key, presignedUrl, error } = await uploadToS3(file);

        if (!presignedUrl || error || !key) {
          toast.error(error || "Error al subir");
          return null;
        }

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(percent);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) resolve();
            else reject(new Error("Falló la subida"));
          };

          xhr.open("PUT", presignedUrl);
          xhr.onerror = () => reject(new Error("Error en la subida"));
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });

        return {
          url: presignedUrl,
          key: key,
          name: file.name,
          size: file.size,
          isMainImage: isMainImage,
        };
      } catch {
        toast.error("Error al subir archivo");
        return null;
      }
    },
    [uploadToS3],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      if (
        (isValueArray(value) ? value.length : 0) + acceptedFiles.length >
        maxFiles
      ) {
        toast.error(`Máximo ${maxFiles} archivos permitidos`);
        return;
      }

      const oversized = acceptedFiles.filter(
        (f) => f.size > maxSize * 1024 * 1024,
      );
      if (oversized.length > 0) {
        toast.error(`Archivo(s) muy grande(s). Máximo ${maxSize}MB`);
        return;
      }

      setUploading({
        isLoading: true,
        isDeleting: false,
      });
      setUploadProgress(0);

      const uploadedArray: ImageInsert[] = [];
      let uploaded: ImageInsert | null = null;

      if (isValueArray(value)) {
        for (let i = 0; i < acceptedFiles.length; i++) {
          // solo es principal si no tiene nada el array de imagenes cargadas y el index es 0
          const isMainImage = !value.length && i === 0;

          const result = await uploadFile(acceptedFiles[i], isMainImage);

          if (result) uploadedArray?.push(result);
        }
        if (uploadedArray.length > 0) {
          onChange([...value, ...uploadedArray]);

          toast.success(`${uploadedArray.length} archivo(s) subido(s)`);
        }
      } else {
        const isMainImage = !value;

        uploaded = await uploadFile(acceptedFiles[0], isMainImage);

        onChange(uploaded);
        toast.success("Archivo subido");
      }

      setUploading({
        isLoading: false,
        isDeleting: false,
      });
      setUploadProgress(0);
    },
    [value, maxFiles, maxSize, onChange, disabled, uploadFile],
  );

  const rejectedFiles = useCallback((fileRejection: FileRejection[]) => {
    if (fileRejection.length) {
      const tooMany = fileRejection.find(
        (r) => r.errors[0].code === "too-many-files",
      );
      const tooBig = fileRejection.find(
        (r) => r.errors[0].code === "file-too-large",
      );
      if (tooMany)
        toast.error("Demasiados archivos. Solo se permite uno por vez.");
      if (tooBig) toast.error("Archivo demasiado grande. Máximo 10MB.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: rejectedFiles,

    accept: accept.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<string, string[]>,
    ),
    maxFiles: maxFiles - (isValueArray(value) ? value.length : 0),
    disabled: disabled || uploading.isLoading || uploading.isDeleting,
    maxSize: maxSize * 1024 * 1024, // in bytes
  });

  const removeFile = async (keyToRemove: string) => {
    if (disabled) return;
    try {
      setUploading({
        isLoading: false,
        isDeleting: true,
      });

      const { success, error } = await deleteFromS3(keyToRemove);

      if (!success || error) {
        toast.error(error || "Error al eliminar");
        return;
      }

      if (isValueArray(value)) {
        const newValuesWithoutRemoved = value.filter(
          (file) => file.key !== keyToRemove,
        );
        // actualizar el isMainImage a la primera imagen de la lista
        if (newValuesWithoutRemoved.length > 0) {
          const firstFile = newValuesWithoutRemoved[0];
          firstFile.isMainImage = true;
          newValuesWithoutRemoved[0] = firstFile;
          onChange(newValuesWithoutRemoved);
        }
        onChange(newValuesWithoutRemoved);
      } else {
        onChange(null);
      }
      toast.success("Archivo eliminado");
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setUploading({
        isLoading: false,
        isDeleting: false,
      });
    }
  };

  if (variant === "avatar") {
    return (
      <AvatarVariant
        className={className}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        uploading={uploading}
        uploadProgress={uploadProgress}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        canUploadMoreFiles={canUploadMoreFiles}
        removeFile={removeFile}
      />
    );
  }

  if (variant === "minimal") {
    return (
      <MinimalVariant
        className={className}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        uploading={uploading}
        uploadProgress={uploadProgress}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        canUploadMoreFiles={canUploadMoreFiles}
        removeFile={removeFile}
        maxFiles={maxFiles}
        maxSize={maxSize}
        id={id}
        preview={preview}
      />
    );
  }

  // Default variant
  return (
    <DefaultVariant
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      uploading={uploading}
      uploadProgress={uploadProgress}
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      isDragActive={isDragActive}
      canUploadMoreFiles={canUploadMoreFiles}
      removeFile={removeFile}
      handleMainImage={handleMainImage}
      preview={preview}
      maxFiles={maxFiles}
      maxSize={maxSize}
    />
  );
}
