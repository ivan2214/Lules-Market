// Helpers extraídos del componente original para mejorar modularidad

import type { ImageInsert } from "@/db";

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
export const isImage = (file: ImageInsert): boolean => {
  const isImg =
    file.url?.includes("https://picsum.photos") ||
    file.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    file.url?.includes("image");

  return !!isImg;
};

/**
 * Guards de tipo utilizados por el componente principal.
 */
export const isImageInsert = (
  val: ImageInsert | ImageInsert[] | null | undefined,
): val is ImageInsert => !!val && !Array.isArray(val);

export const isValueArray = (
  val: ImageInsert | ImageInsert[] | null | undefined,
): val is ImageInsert[] => Array.isArray(val);

export const canUploadMoreFiles = (
  value: ImageInsert | ImageInsert[] | null | undefined,
  max = 5,
): boolean => {
  if (!value || (value as ImageInsert).url === "") return true;
  if (Array.isArray(value)) return value.length < max;
  return max > 1 ? 1 < max : false;
};
