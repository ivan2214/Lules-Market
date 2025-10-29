"use client";

import { AlertTriangle, CheckCircle, Search, Trash2 } from "lucide-react";
import { useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockImages } from "@/lib/data/mock-data";
import type { Image } from "@/types/admin";

export default function MediaPage() {
  const [images, setImages] = useState(mockImages);
  const [filter, setFilter] = useState<"all" | "reported">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const handleDelete = (imageId: string) => {
    setImages(images.filter((img) => img.id !== imageId));
    setDeleteDialogOpen(false);
    console.log("Eliminar imagen:", imageId);
  };

  const handleMarkSafe = (imageId: string) => {
    setImages(
      images.map((img) =>
        img.id === imageId ? { ...img, isReported: false } : img,
      ),
    );
    console.log("Marcar como segura:", imageId);
  };

  const filteredImages = images.filter((image) => {
    if (filter === "reported" && !image.isReported) return false;
    if (
      searchQuery &&
      !image.url.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Moderación de Contenido
        </h1>
        <p className="text-muted-foreground">
          Revisa y modera imágenes cargadas por los negocios
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Imágenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{images.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Reportadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-yellow-600">
              {images.filter((img) => img.isReported).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Seguras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {images.filter((img) => !img.isReported).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as typeof filter)}
      >
        <TabsList>
          <TabsTrigger value="all">Todas ({images.length})</TabsTrigger>
          <TabsTrigger value="reported">
            Reportadas ({images.filter((img) => img.isReported).length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value={filter} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Galería de Imágenes</CardTitle>
              <CardDescription>
                {filteredImages.length} imagen
                {filteredImages.length !== 1 ? "es" : ""} encontrada
                {filteredImages.length !== 1 ? "s" : ""}
              </CardDescription>
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar imágenes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredImages.map((image) => (
                  <Card
                    key={image.id}
                    className={image.isReported ? "border-yellow-500" : ""}
                  >
                    <CardContent className="p-4">
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                        <img
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
                          {new Date(image.uploadedAt).toLocaleDateString(
                            "es-AR",
                          )}
                        </p>
                        <div className="flex gap-2">
                          {image.isReported && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkSafe(image.id)}
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
        </TabsContent>
      </Tabs>

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
              onClick={() => selectedImage && handleDelete(selectedImage.id)}
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
