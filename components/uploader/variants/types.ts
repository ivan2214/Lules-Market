"use client";

import type React from "react";
import type { ImageCreateInput } from "@/app/data/image/image.dto";

export type VariantCommonProps = {
  className?: string | undefined;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  maxFiles?: number | undefined;
  maxSize?: number | undefined;
  preview?: "grid" | "list" | undefined;
  value?: ImageCreateInput | ImageCreateInput[] | null | undefined;
  uploading?: boolean | undefined;
  uploadProgress?: number | undefined;
  /** isDragActive viene directamente desde useDropzone y se pasa aquí */
  isDragActive?: boolean | undefined;
  getRootProps: (
    props?: React.HTMLAttributes<HTMLDivElement>
  ) => React.HTMLAttributes<HTMLDivElement>;
  getInputProps: (
    props?: React.InputHTMLAttributes<HTMLInputElement>
  ) => React.InputHTMLAttributes<HTMLInputElement>;
  canUploadMoreFiles: (
    value: ImageCreateInput | ImageCreateInput[] | null | undefined,
    max?: number
  ) => boolean;
  removeFile: (key: string) => void;
  handleMainImage?: (key: string) => void;
};
