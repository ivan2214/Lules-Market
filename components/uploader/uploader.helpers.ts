// Helpers extraídos del componente original para mejorar modularidad

import type { UploadedFile } from "./uploader.types";

/**
 * Formatea bytes a una representación legible.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

/**
 * Determina si un archivo subido es una imagen basándose en el nombre o la url.
 */
export const isImage = (file: UploadedFile): boolean => {
  const isImg =
    file.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    file.url?.includes("image");

  return !!isImg;
};

/**
 * Guards de tipo utilizados por el componente principal.
 */
export const isUploadedFile = (
  val: UploadedFile | UploadedFile[] | null | undefined,
): val is UploadedFile => !!val && !Array.isArray(val);

export const isValueArray = (
  val: UploadedFile | UploadedFile[] | null | undefined,
): val is UploadedFile[] => Array.isArray(val);

export const canUploadMoreFiles = (
  value: UploadedFile | UploadedFile[] | null | undefined,
  max = 5,
): boolean => {
  if (!value) return true;
  if (Array.isArray(value)) return value.length < max;
  return max > 1 ? 1 < max : false;
};
