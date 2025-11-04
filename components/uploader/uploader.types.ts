import type { ImageCreateInput } from "@/app/data/image/image.dto";

export interface UploaderProps {
  variant?: "default" | "compact" | "minimal" | "avatar";
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string[];
  preview?: "grid" | "list";
  onChange: (files: (ImageCreateInput | ImageCreateInput[]) | null) => void;
  value?: ImageCreateInput | ImageCreateInput[] | null;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  folder: string;
  id?: string | undefined;
}
