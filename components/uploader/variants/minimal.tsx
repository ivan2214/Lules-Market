"use client";

import { Upload, X } from "lucide-react";

import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ImageInsert } from "@/db/types";
import { cn } from "@/lib/utils";
import { isImage } from "../uploader.helpers";
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
  }: VariantCommonProps = props;

  const canUpload = canUploadMoreFiles(value, props.maxFiles);

  return (
    <div className={cn("space-y-2", className)}>
      {!uploading?.isLoading && !uploading?.isDeleting && canUpload && (
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

      {uploading?.isLoading && (
        <div className="space-y-2">
          <div className="h-2 bg-gray-100" />
          <p className="text-center text-gray-500 text-xs">Subiendo...</p>
        </div>
      )}

      {uploading?.isDeleting && (
        <div className="space-y-2">
          <div className="h-2 bg-gray-100" />
          <p className="text-center text-gray-500 text-xs">Eliminando...</p>
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
        !Array.isArray(value) &&
        value.url !== "" && (
          <div className="space-y-1">
            <div
              key={(value as ImageInsert).key}
              className="flex items-center justify-between rounded bg-gray-50 p-2"
            >
              <div className="flex items-center justify-start gap-2">
                {isImage(value as ImageInsert) && (
                  <div className="h-12 w-12">
                    <ImageWithSkeleton
                      src={value.url}
                      alt={(value as ImageInsert).name || "Archivo"}
                      className="aspect-square h-full w-full rounded object-cover object-center"
                    />
                  </div>
                )}
                <span className="truncate text-sm">
                  {(value as ImageInsert).name || "Archivo"}
                </span>
              </div>
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Estas seguro de eliminar esta imagen?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Es permanente (no se
                        puede recuperar, deberas subir una nueva).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => removeFile((value as ImageInsert).key)}
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
