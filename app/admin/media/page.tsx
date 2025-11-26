import { cacheLife, cacheTag } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { MediaClient } from "./components/media-client";

const getImages = async (page?: string, limit?: string) => {
  "use cache";
  cacheLife("hours");
  cacheTag("media-page");
  return await prisma.image.findMany({
    take: limit ? Number(limit) : 10,
    skip: page ? Number(page) * (limit ? Number(limit) : 10) : 0,
  });
};

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}) {
  const { page, limit } = await searchParams;
  const images = await getImages(page, limit);
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

      <MediaClient images={images} />
    </div>
  );
}
