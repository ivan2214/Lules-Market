"use client";

import { Upload, X } from "lucide-react";
import type { ImageInsert } from "@/db/types";
import { cn } from "@/lib/utils";
import { ImageWithSkeleton } from "@/shared/components/image-with-skeleton";
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
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import type { VariantCommonProps } from "./types";

export function AvatarVariant(props: VariantCommonProps) {
  const {
    className,
    disabled,
    placeholder,
    value,
    uploading,
    getRootProps,
    getInputProps,
    removeFile,
    isDragActive,
    canUploadMoreFiles,
  }: VariantCommonProps = props;

  return (
    <div className={cn("space-y-2", className)}>
      {!uploading?.isLoading &&
      !uploading?.isDeleting &&
      canUploadMoreFiles &&
      !(value as ImageInsert)?.url ? (
        <div
          {...getRootProps()}
          className={cn(
            "h-32 w-32 cursor-pointer rounded-full border-2 border-dashed p-4 text-center transition-colors",
            isDragActive
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-gray-400",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600 text-xs">
            {placeholder || "Arrastra archivos o haz clic para seleccionar"}
          </p>
        </div>
      ) : (
        <div className="group relative h-32 w-32">
          <ImageWithSkeleton
            src={(value as ImageInsert).url || "/placeholder.svg"}
            alt={(value as ImageInsert).name || "Avatar"}
            className="aspect-square h-full min-h-32 w-full min-w-32 rounded-full border-4 border-gray-200 object-cover object-center"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
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
                  Esta acción no se puede deshacer. Es permanente (no se puede
                  recuperar, deberas subir una nueva).
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
      )}

      {(uploading?.isLoading || uploading?.isDeleting) && (
        <div className="h-2 rounded-full bg-gray-100" />
      )}
    </div>
  );
}
