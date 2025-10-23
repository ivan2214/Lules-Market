"use client";

import { Check, File, Loader2, StarIcon, Upload, X } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatFileSize, isImage } from "../uploader.helpers";
import type { UploadedFile } from "../uploader.types";
import type { VariantCommonProps } from "./types";

export function CompactVariant(props: VariantCommonProps) {
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
    handleMainImage,
    preview,
  } = props;

  return (
    <div className={cn("space-y-3", className)}>
      {!uploading && canUploadMoreFiles(value, props.maxFiles) && (
        <div
          {...getRootProps()}
          className={cn(
            "cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
            props.isDragActive
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-gray-400",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="mb-1 font-medium text-gray-700 text-sm">
            {placeholder || "Subir archivos"}
          </p>
          <p className="text-gray-500 text-xs">
            Máximo {props.maxFiles} archivos, {props.maxSize}MB cada uno
          </p>
        </div>
      )}

      {uploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <div className="flex-1">
                <Progress value={uploadProgress} className="h-2" />
              </div>
              <span className="text-gray-500 text-sm">{uploadProgress}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {Array.isArray(value) && value?.length > 0 ? (
        preview === "grid" ? (
          <Card>
            <CardContent className="grid grid-cols-2 gap-2">
              {value
                ?.toSorted(
                  (a, b) => Number(b.isMainImage) - Number(a.isMainImage),
                )
                .map((file) => (
                  <div key={file.key} className="group relative">
                    {isImage(file) ? (
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <ImageWithSkeleton
                          src={file.url || "/placeholder.svg"}
                          alt={file.name || "Imagen"}
                          className="object-cover"
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
                      <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100">
                        <File className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
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
                            Esta acción no se puede deshacer. Es permanente (no
                            se puede recuperar, deberas subir una nueva).
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
                        onClick={() => handleMainImage?.(file.key)}
                      >
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                      </Button>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {value
              ?.toSorted(
                (a, b) => Number(b.isMainImage) - Number(a.isMainImage),
              )
              .map((file) => (
                <div key={file.key} className="group">
                  <Card className="group relative">
                    <CardContent className="mt-2 flex items-center justify-between gap-3">
                      {isImage(file) ? (
                        <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
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

                      <div className="flex flex-col items-start gap-2">
                        <p className="line-clamp-6 truncate font-medium text-sm">
                          {file.name
                            ? file.name.length > 20
                              ? `${file.name.slice(0, 20)}…`
                              : file.name
                            : "Archivo"}
                        </p>

                        {file.size != null && (
                          <p className="text-gray-500 text-xs">
                            {formatFileSize(file.size)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Check className="h-3 w-3" />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6"
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
                                Esta acción no se puede deshacer. Es permanente
                                (no se puede recuperar, deberas subir una
                                nueva).
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
                      </div>
                    </CardContent>
                    {!file.isMainImage && (
                      <Button
                        title="Imagen principal"
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={disabled}
                        className="absolute top-2 left-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleMainImage?.(file.key)}
                      >
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                      </Button>
                    )}
                    {file.isMainImage && (
                      <Button
                        title="Marcar como principal"
                        type="button"
                        size="icon"
                        variant="outline"
                        className="absolute top-2 left-2 h-6 w-6"
                      >
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                      </Button>
                    )}
                  </Card>
                </div>
              ))}
          </div>
        )
      ) : (
        value &&
        !Array.isArray(value) && (
          <Card className="w-fit">
            <CardContent>
              <div
                key={(value as UploadedFile).key}
                className="group relative h-48 w-48"
              >
                {isImage(value as UploadedFile) ? (
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <ImageWithSkeleton
                      src={(value as UploadedFile).url || "/placeholder.svg"}
                      alt={(value as UploadedFile).name || "Imagen"}
                      className="object-cover"
                    />
                    {(value as UploadedFile).isMainImage && (
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
                  <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100">
                    <File className="h-8 w-8 text-gray-400" />
                  </div>
                )}
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
                        Esta acción no se puede deshacer. Es permanente (no se
                        puede recuperar, deberas subir una nueva).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => removeFile((value as UploadedFile).key)}
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {!(value as UploadedFile).isMainImage && (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    disabled={disabled}
                    className="absolute top-2 left-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      handleMainImage?.((value as UploadedFile).key)
                    }
                  >
                    <StarIcon className="h-4 w-4 text-yellow-500" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
