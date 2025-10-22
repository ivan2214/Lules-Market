"use client";

import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UploadedFile } from "../uploader.types";
import type { VariantCommonProps } from "./types";

export function MinimalVariant(props: VariantCommonProps) {
  const {
    className,
    disabled,
    placeholder,
    value,
    uploading,
    getRootProps,
    getInputProps,
    canUploadMoreFiles,
    removeFile,
  } = props;

  return (
    <div className={cn("space-y-2", className)}>
      {!uploading && canUploadMoreFiles(value, props.maxFiles) && (
        <div
          {...getRootProps()}
          className={cn(
            "cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors",
            props.isDragActive
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-gray-400",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-2 h-6 w-6 text-gray-400" />
          <p className="text-gray-600 text-sm">
            {placeholder || "Arrastra archivos o haz clic para seleccionar"}
          </p>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="h-2 bg-gray-100" />
          <p className="text-center text-gray-500 text-xs">Subiendo...</p>
        </div>
      )}

      {Array.isArray(value) && value?.length > 0 ? (
        <div className="space-y-1">
          {value?.map((file) => (
            <div
              key={file.key}
              className="flex items-center justify-between rounded bg-gray-50 p-2"
            >
              <span className="truncate text-sm">{file.name || "Archivo"}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.key)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        value &&
        !Array.isArray(value) && (
          <div className="space-y-1">
            <div
              key={(value as UploadedFile).key}
              className="flex items-center justify-between rounded bg-gray-50 p-2"
            >
              <span className="truncate text-sm">
                {(value as UploadedFile).name || "Archivo"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile((value as UploadedFile).key)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
