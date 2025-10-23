"use client";

import { Check, File, StarIcon, Upload, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatFileSize, isImage } from "../uploader.helpers";
import type { UploadedFile } from "../uploader.types";
import type { VariantCommonProps } from "./types";

export function DefaultVariant(props: VariantCommonProps) {
  const {
    className,
    disabled,
    placeholder,
    value,
    uploading,
    uploadProgress,
    getRootProps,
    getInputProps,
    canUploadMoreFiles,
    removeFile,
  } = props;

  return (
    <div className={cn("space-y-4", className)}>
      {!uploading && canUploadMoreFiles(value, props.maxFiles) && (
        <div
          {...getRootProps()}
          className={cn(
            "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            props.isDragActive
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-gray-400",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-gray-100 p-3">
                <Upload className="h-8 w-8 text-gray-600" />
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium text-gray-700 text-lg">
                {props.isDragActive
                  ? "Suelta los archivos aquí"
                  : placeholder || "Arrastra archivos aquí"}
              </p>
              <p className="mb-4 text-gray-500 text-sm">
                o haz clic para seleccionar archivos
              </p>
              <div className="flex justify-center gap-4 text-gray-400 text-xs">
                <span>Máximo {props.maxFiles} archivos</span>
                <span>•</span>
                <span>Hasta {props.maxSize}MB cada uno</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={disabled || uploading}
            >
              Seleccionar archivos
            </Button>
          </div>
        </div>
      )}

      {uploading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  Subiendo archivos...
                </span>
                <span className="text-gray-500 text-sm">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {Array.isArray(value) && value?.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">
              Archivos subidos ({value?.length})
            </h4>
            <Badge variant="secondary">
              {value?.length}/{props.maxFiles}
            </Badge>
          </div>

          {props.preview === "grid" ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {value
                ?.toSorted(
                  (a, b) => Number(b.isMainImage) - Number(a.isMainImage),
                )
                .map((file) => (
                  <div key={file.key} className="group relative">
                    <Card className="overflow-hidden p-0">
                      <CardContent className="p-0">
                        {isImage(file) ? (
                          <div className="relative h-20 w-20 overflow-hidden">
                            <ImageWithSkeleton
                              src={file.url || "/placeholder.svg"}
                              alt={file.name || "Imagen"}
                              className="aspect-square h-full w-full object-cover"
                            />
                            {file.isMainImage && (
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                className="absolute top-2 left-2 h-6 w-6"
                              >
                                <StarIcon className="h-4 w-4 text-yellow-500" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="flex aspect-square items-center justify-center bg-gray-50">
                            <File className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="p-3">
                          <p className="truncate font-medium text-xs">
                            {file.name || "Archivo"}
                          </p>
                          {file.size != null && (
                            <p className="text-gray-500 text-xs">
                              {formatFileSize(file.size)}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="-top-2 -right-2 absolute h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
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
                            Esta acción no se puede deshacer. Es permanente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            onClick={() => removeFile(file.key)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {!file.isMainImage && (
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={disabled}
                        className="absolute top-2 left-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => props.handleMainImage?.(file.key)}
                      >
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="space-y-2">
              {value?.map((file) => (
                <Card key={file.key}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {isImage(file) ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded bg-gray-100">
                          <ImageWithSkeleton
                            src={file.url || "/placeholder.svg"}
                            alt={file.name || "Imagen"}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                          <File className="h-6 w-6 text-gray-400" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-sm">
                          {file.name || "Archivo"}
                        </p>
                        {file.size != null && (
                          <p className="text-gray-500 text-xs">
                            {formatFileSize(file.size)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Subido
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.key)}
                          disabled={disabled}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        value &&
        !Array.isArray(value) && (
          <div className="space-y-2">
            <Card key={(value as UploadedFile).key}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {isImage(value as UploadedFile) ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-gray-100">
                      <ImageWithSkeleton
                        src={(value as UploadedFile).url || "/placeholder.svg"}
                        alt={(value as UploadedFile).name || "Imagen"}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                      <File className="h-6 w-6 text-gray-400" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">
                      {(value as UploadedFile).name || "Archivo"}
                    </p>
                    {(value as UploadedFile).size != null && (
                      <p className="text-gray-500 text-xs">
                        {formatFileSize((value as UploadedFile).size as number)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" />
                      Subido
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile((value as UploadedFile).key)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  );
}
