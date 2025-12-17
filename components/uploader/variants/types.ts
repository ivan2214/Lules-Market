"use client";

import type React from "react";
import type { ImageInsert } from "@/db/types";

export type VariantCommonProps = {
  id?: string | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  maxFiles?: number | undefined;
  maxSize?: number | undefined;
  preview?: "grid" | "list" | undefined;
  value?: ImageInsert | ImageInsert[] | null | undefined;
  uploading?:
    | {
        isLoading: boolean;
        isDeleting: boolean;
      }
    | undefined;
  uploadProgress?: number | undefined;
  /** isDragActive viene directamente desde useDropzone y se pasa aquí */
  isDragActive?: boolean | undefined;
  getRootProps: (
    props?: React.HTMLAttributes<HTMLDivElement>,
  ) => React.HTMLAttributes<HTMLDivElement>;
  getInputProps: (
    props?: React.InputHTMLAttributes<HTMLInputElement>,
  ) => React.InputHTMLAttributes<HTMLInputElement>;
  canUploadMoreFiles: (
    value: ImageInsert | ImageInsert[] | null | undefined,
    max?: number,
  ) => boolean;
  removeFile: (key: string) => void;
  handleMainImage?: (key: string) => void;
};
