"use client";

import { Check, File, StarIcon, Upload, X } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
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
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "../../ui/item";
import { formatFileSize, isImage } from "../uploader.helpers";
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
    maxFiles,
    preview,
    handleMainImage,
    isDragActive,
    maxSize,
  }: VariantCommonProps = props;

  return (
    <div className={cn("space-y-4", className)}>
      {!uploading?.isLoading &&
        !uploading?.isDeleting &&
        canUploadMoreFiles && (
          <div
            {...getRootProps()}
            className={cn(
              "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
              isDragActive
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
                  {isDragActive
                    ? "Suelta los archivos aquí"
                    : placeholder || "Arrastra archivos aquí"}
                </p>
                <p className="mb-4 text-gray-500 text-sm">
                  o haz clic para seleccionar archivos
                </p>
                <div className="flex justify-center gap-4 text-gray-400 text-xs">
                  <span>Máximo {maxFiles} archivos</span>
                  <span>•</span>
                  <span>Hasta {maxSize}MB cada uno</span>
                </div>
              </div>

              <Button type="button" variant="outline" disabled={disabled}>
                Seleccionar archivos
              </Button>
            </div>
          </div>
        )}

      {uploading?.isLoading && (
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
      {uploading?.isDeleting && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  Eliminando archivos...
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
              {value?.length}/{maxFiles}
            </Badge>
          </div>

          {preview === "grid" ? (
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
                        onClick={() => handleMainImage?.(file.key)}
                      >
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <ItemGroup>
              {value
                ?.toSorted((a) => (a.isMainImage ? -1 : 1))
                .map((file, index) => (
                  <Fragment key={file.key}>
                    <Item
                      variant="outline"
                      className={cn(
                        "group relative mt-1 hover:bg-yellow-500/50 hover:text-white",
                        file.isMainImage && "bg-yellow-500/50 text-white",
                      )}
                    >
                      {file.isMainImage && (
                        <Badge
                          className="-top-2 -left-4 absolute"
                          variant="secondary"
                        >
                          Principal
                        </Badge>
                      )}
                      <ItemMedia>
                        {isImage(file) ? (
                          <Avatar>
                            <AvatarImage
                              src={file.url || "/placeholder.svg"}
                              className="grayscale"
                            />
                            <AvatarFallback>
                              {file.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                            <File className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </ItemMedia>
                      <ItemContent className="gap-1">
                        <ItemTitle>{file.name || "Archivo"}</ItemTitle>
                        {file.size != null && (
                          <ItemDescription>
                            {formatFileSize(file.size)}
                          </ItemDescription>
                        )}
                      </ItemContent>
                      <ItemActions>
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
                              className="h-6 w-6 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
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
                                onClick={() =>
                                  removeFile((file as ImageInsert).key)
                                }
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        {!file.isMainImage && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="absolute top-2 left-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                disabled={disabled}
                              >
                                <StarIcon className="h-4 w-4 text-yellow-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Estas seguro de establecer esta imagen como
                                  principal?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Confirma que deseas establecer esta imagen
                                  como principal.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleMainImage?.(file.key)}
                                  className="bg-yellow-500 text-white hover:bg-yellow-500/90"
                                >
                                  Establecer como principal
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </ItemActions>
                    </Item>
                    {index !== value.length - 1 && (
                      <ItemSeparator className="my-1" />
                    )}
                  </Fragment>
                ))}
            </ItemGroup>
          )}
        </div>
      ) : (
        value &&
        (value as ImageInsert)?.url?.length > 0 &&
        !Array.isArray(value) && (
          <Item variant="outline">
            <ItemMedia>
              {isImage(value) ? (
                <Avatar>
                  <AvatarImage
                    src={value.url || "/placeholder.svg"}
                    className="grayscale"
                  />
                  <AvatarFallback>{value.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                  <File className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </ItemMedia>
            <ItemContent className="gap-1">
              <ItemTitle>{value.name || "Archivo"}</ItemTitle>
              {value.size != null && (
                <ItemDescription>{formatFileSize(value.size)}</ItemDescription>
              )}
            </ItemContent>
            <ItemActions>
              <Badge variant="secondary" className="flex items-center gap-1">
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
                      Esta acción no se puede deshacer. Es permanente.
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
            </ItemActions>
          </Item>
        )
      )}
    </div>
  );
}
