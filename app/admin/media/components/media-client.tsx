"use client";

import { AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Image } from "@/db/types";

type MediaClientProps = {
  images: Image[];
};

export const MediaClient: React.FC<MediaClientProps> = ({ images }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const handleDelete = (_imageId: string) => {
    setDeleteDialogOpen(false);
  };

  const handleMarkSafe = (_imageId: string) => {};

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Galería de Imágenes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <Card
                key={image.key}
                className={image.isReported ? "border-yellow-500" : ""}
              >
                <CardContent className="p-4">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <ImageWithSkeleton
                      src={image.url || "/placeholder.svg"}
                      alt="Imagen del producto"
                      className="h-full w-full object-cover"
                    />
                    {image.isReported && (
                      <Badge className="absolute top-2 right-2 bg-yellow-600">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Reportada
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-muted-foreground text-sm">
                      Subida:{" "}
                      {new Date(image.createdAt).toLocaleDateString("es-AR")}
                    </p>
                    <div className="flex gap-2">
                      {image.isReported && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkSafe(image.key)}
                          className="flex-1"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar Segura
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedImage(image);
                          setDeleteDialogOpen(true);
                        }}
                        className="flex-1"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar esta imagen. Esta acción no se puede
              deshacer y la imagen será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedImage && handleDelete(selectedImage.key)}
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
