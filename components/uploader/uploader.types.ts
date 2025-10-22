// Archivo generado: extrae los tipos originales del componente Uploader
// Mantiene exactamente las interfaces originales para compatibilidad.
export interface UploadedFile {
  url: string;
  key: string;
  name?: string | null;
  size?: number | null;
  isMainImage?: boolean;
}

export interface UploaderProps {
  variant?: "default" | "compact" | "minimal" | "avatar";
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string[];
  preview?: "grid" | "list";
  onChange: (files: (UploadedFile | UploadedFile[]) | null) => void;
  value?: UploadedFile | UploadedFile[] | null;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  folder: string;
}
