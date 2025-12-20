import type { ImageInsert } from "@/db/types";

export interface UploaderProps {
  variant?: "default" | "minimal" | "avatar";
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string[];
  preview?: "grid" | "list";
  onChange: (files: (ImageInsert | ImageInsert[]) | null) => void;
  value?: ImageInsert | ImageInsert[] | null;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  folder: string;
  id?: string | undefined;
}
