"use client";

import { Check, File, Loader2, StarIcon, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ImageWithSkeleton } from "../image-with-skeleton";
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
} from "../ui/alert-dialog";
import { formatFileSize, isImage } from "./uploader.helpers";
import type { UploadedFile } from "./uploader.types";

/*
  Nota: Este archivo agrupa los fragmentos de UI por variante extraídos
  del componente original. Reciben props reducidas necesarias para
  renderizar (value, uploading, uploadProgress, getRootProps, getInputProps,
  removeFile, canUploadMoreFiles, handleMainImage, etc.).
*/

export type VariantCommonProps = {
  className?: string | undefined;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  maxFiles?: number | undefined;
  maxSize?: number | undefined;
  preview?: "grid" | "list" | undefined;
  value?: UploadedFile | UploadedFile[] | null | undefined;
  uploading?: boolean | undefined;
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
    value: UploadedFile | UploadedFile[] | null | undefined,
    max?: number,
  ) => boolean;
  removeFile: (key: string) => void;
  handleMainImage?: (key: string) => void;
};

export function AvatarVariant(props: VariantCommonProps) {
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
    <div className={cn("space-y-2", className)}>
      {!uploading && canUploadMoreFiles(value, props.maxFiles) && (
        <div
          {...getRootProps()}
          className={cn(
            "h-32 w-32 cursor-pointer rounded-full border-2 border-dashed p-4 text-center transition-colors",
            props.isDragActive
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
      )}

      {uploading && <Progress value={uploadProgress} className="h-2" />}

      {value && !Array.isArray(value) && (
        <Card className="w-fit">
          <CardContent className="flex items-center gap-4">
            <div className="group relative h-32 w-32">
              <ImageWithSkeleton
                src={(value as UploadedFile).url || "/placeholder.svg"}
                alt={(value as UploadedFile).name || "Avatar"}
                className="h-full min-h-32 w-full min-w-32 rounded-full border-4 border-gray-200"
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function MinimalVariant(props: VariantCommonProps) {
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
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-center text-gray-500 text-xs">
            Subiendo... {uploadProgress}%
          </p>
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
          <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
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
                <Card key={file.key} className="group relative">
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
                            ? file.name.slice(0, 20) + "…"
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
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        Subido
                      </Badge>
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
                              (no se puede recuperar, deberas subir una nueva).
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

// Helpers locales usados por CompactVariant (importado arriba junto a isImage/formatFileSize)

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
