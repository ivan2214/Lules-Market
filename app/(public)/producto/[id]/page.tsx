import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  ArrowLeft,
  Clock,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getPublicProduct,
  getPublicProducts,
} from "@/app/actions/public-actions";
import { ProductSchema } from "@/components/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mainImage } from "@/utils/main-image";
import { ProductImages } from "./components/product-images";
import { ProductViewTracker } from "./components/product-view-tracker";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const product = await getPublicProduct(id);

  if (!product) {
    notFound();
  }

  const ogImages = product.images?.map((image) => ({
    url: image.url,
    width: 1200,
    height: 630,
    alt: product.name,
  }));

  const seoDescription = product.description
    ? `${product.description.substring(0, 155)}${product.description.length > 155 ? "..." : ""}`
    : `Compra ${product.name} en Lules Market. Productos de calidad en Argentina.`;

  const keywords = [
    product.name,
    product.category,
    product.business?.name,
    "comprar online",
    "Argentina",
    "Lules Market",
    "productos",
  ].filter(Boolean);

  return {
    title: `${product.name} | ${product.business?.name} | Lules Market`,
    description: seoDescription,
    keywords: keywords.join(", "),
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: `https://lules-market.vercel.app/productos/${id}`,
    },
    openGraph: {
      type: "website",
      countryName: "Argentina",
      title: product.name,
      siteName: "Lules Market",
      description: seoDescription,
      images: ogImages?.length
        ? ogImages
        : [
            {
              url: "https://lules-market.vercel.app/og-image.jpg",
              width: 1200,
              height: 630,
              alt: "Lules Market",
            },
          ],
      locale: "es_AR",
      url: `https://lules-market.vercel.app/productos/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: seoDescription,
      images: ogImages?.length
        ? [ogImages[0].url]
        : ["https://lules-market.vercel.app/og-image.jpg"],
      creator: "@lulesmarket",
      site: "@lulesmarket",
    },
    authors: [
      {
        name: product.business?.name,
        url: `https://lules-market.vercel.app/comercios/${product.business?.id}`,
      },
    ],
    category: product.category?.label,
    other: {
      "product:price:amount": product.price?.toString() || "",
      "product:price:currency": "ARS",
    },
  };
}

export async function generateStaticParams() {
  const { products } = await getPublicProducts();

  if (!products.length) {
    return [{ id: "default" }]; // fallback para que el build no falle
  }

  return products.map((product) => ({ id: product.id }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getPublicProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container space-y-8 px-4 py-6">
      {/* ✅ Tracking envuelto en Suspense */}
      <Suspense fallback={null}>
        <ProductViewTracker productId={id} />
      </Suspense>

      <ProductSchema
        name={product.name}
        description={product.description || ""}
        price={product.price || 0}
        image={mainImage(product.images || [])}
        seller={{
          name: product.business?.name || "",
          url: `https://lules-market.vercel.app/comercios/${product.business?.id}`,
        }}
      />
      <Button variant="ghost" className="mb-4 gap-2" asChild>
        <Link href="/explorar/productos">
          <ArrowLeft className="h-4 w-4" />
          Volver a productos
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2">
          <ProductImages images={product.images} name={product.name} />
          {/* Product Details Tabs */}
          <Card>
            <Tabs defaultValue="description" className="w-full">
              <CardHeader>
                <TabsList className="w-full grid-cols-3">
                  <TabsTrigger value="description">Descripción</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="description" className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold">
                      Descripción del producto
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        {/* Right Column - Purchase Info & Business */}

        {/* Right Column - Purchase Info & Business */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card>
            <CardHeader>
              <div className="mb-2 flex items-start justify-between">
                <Badge
                  key={product.category?.id}
                  variant="outline"
                  className="text-xs"
                >
                  {product.category?.value}
                </Badge>

                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-3xl text-primary">
                    ${product.price?.toLocaleString()}
                  </span>
                  {/*     {product.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                      <Badge variant="destructive">
                        {product.discount}% OFF
                      </Badge>
                    </>
                  )} */}
                </div>
                <p className="mt-1 text-muted-foreground text-sm">
                  Precio en efectivo o transferencia
                </p>
              </div>

              <Separator />

              {/* Stock */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Disponibilidad</span>
                  <span className="font-semibold text-primary">
                    {product.stock && product.stock > 0
                      ? `${product.stock} unidades disponibles`
                      : "Sin stock"}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  className="w-full gap-2"
                  size="lg"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Comprar ahora
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar disponibilidad
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Star className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">
                    Vendedor verificado
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">
                    Entrega en 24-48 hs
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Información del comercio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link
                href={`/comercio/${product.business?.id}`}
                className="flex items-center gap-3"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={product.business?.logo?.url || "/placeholder.svg"}
                  />
                  <AvatarFallback>{product.business?.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{product.business?.name}</p>
                  </div>
                </div>
              </Link>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {product.business?.address}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <a
                    href={`tel:${product.business?.phone}`}
                    className="text-primary hover:underline"
                  >
                    {product.business?.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <a
                    href={`mailto:${product.business?.email}`}
                    className="text-primary hover:underline"
                  >
                    {product.business?.email}
                  </a>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                asChild
              >
                <Link href={`/comercio/${product.business?.id}`}>
                  Ver perfil del comercio
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
