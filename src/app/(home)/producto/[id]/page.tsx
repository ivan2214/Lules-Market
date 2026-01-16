import {
  CheckCircle2,
  ChevronRight,
  MapIcon,
  MessageCircle,
  Share2,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";
import {
  getProductById,
  getProductIds,
  getSimilarProducts,
} from "@/data/products/get";
import { env } from "@/env/server";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/shared/components/product-card";
import { ProductSchema } from "@/shared/components/structured-data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { mainImage } from "@/shared/utils/main-image";
import { ProductImages } from "./_components/product-images";
import { ProductViewTracker } from "./_components/product-view-tracker";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    return {
      title: "Producto no encontrado | Lules Market",
      description: "El producto que buscas no existe o ha sido eliminado.",
    };
  }

  const businessName = product.business?.name || "Lules Market";
  const title = `${product.name} en ${businessName} | Lules Market`;
  const description =
    product.description ||
    `Encontrá ${product.name} y más productos en ${businessName}.`;
  const imageUrl = product.images?.[0]?.url || "/images/placeholder.svg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: "website",
      siteName: "Lules Market",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  // Solo pre-renderizamos los 100 más recientes para mantener el build rápido
  return await getProductIds(100);
}

export default function ProductLayout({ params }: ProductPageProps) {
  const resolvedParams = use(params);

  return (
    <div className="container mx-auto max-w-7xl animate-fade-in px-4 py-8">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent productId={resolvedParams.id} />
      </Suspense>
    </div>
  );
}

async function ProductContent({ productId }: { productId: string }) {
  const product = await getProductById(productId);

  if (!product || !product.business) {
    notFound();
  }

  const similarProducts = await getSimilarProducts({
    productId: product.id,
    limit: 4,
  });

  const planType = product.business?.currentPlan?.plan?.type || "FREE";
  const isPremium = planType === "PREMIUM";
  const whatsappMessage = encodeURIComponent(
    `Hola ${product.business?.name}, vi su producto "${product.name}" en Lules Market y me interesa.`,
  );

  return (
    <div className="container mx-auto overflow-hidden">
      <Suspense fallback={null}>
        <ProductViewTracker productId={product.id} />
      </Suspense>
      <ProductSchema
        name={product.name}
        description={product.description}
        availability={
          product.stock && product.stock > 0 ? "InStock" : "OutOfStock"
        }
        price={product.price}
        image={mainImage({ images: product.images })}
        currency="MXN"
        seller={{
          name: product.business?.name || "Sin nombre",
          url: `${env.APP_URL}/producto/${product.id}`,
        }}
        url={`${env.APP_URL}/producto/${product.id}`}
      />
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/"
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            <Link
              href="/explorar/productos"
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Productos
            </Link>
            {product.category && (
              <>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                <Link
                  href={`/explorar/productos?category=${product.category.value}`}
                  className="font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {product.category.label}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            <span className="font-semibold text-foreground">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 py-0 md:px-4 md:py-6">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Images */}
          <div className="lg:col-span-7">
            <ProductImages images={product.images} name={product.name} />
          </div>

          <div className="flex flex-col gap-4 px-8 lg:col-span-5 lg:px-0">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <Badge variant="secondary" className="font-semibold text-sm">
                    {product.category.label}
                  </Badge>
                )}
                {isPremium && (
                  <Badge className="border-none bg-linear-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700">
                    Destacado
                  </Badge>
                )}
              </div>
              <h1 className="font-bold text-xl leading-tight tracking-tight md:text-2xl lg:text-3xl">
                {product.name}
              </h1>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="whitespace-pre-line text-base text-muted-foreground leading-relaxed">
                  {product.description ||
                    "El vendedor no ha proporcionado una descripción detallada para este producto."}
                </p>
              </div>
            </div>

            <Separator className="my-0" />

            <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-5">
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "font-bold text-2xl",
                    product.discount > 0
                      ? "text-gray-400 text-xl line-through"
                      : "text-primary",
                  )}
                >
                  {formatCurrency(product.price || 0, "ARS")}
                </span>

                {product.discount > 0 && (
                  <>
                    <span className="font-bold text-2xl text-primary">
                      {formatCurrency(
                        (product.price || 0) * (1 - product.discount / 100),
                        "ARS",
                      )}
                    </span>
                    <span className="rounded bg-yellow-500 px-2 py-1 font-semibold text-sm text-white dark:bg-yellow-600">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Precio sujeto a modificaciones. Consultar vigencia.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link
                  href={`https://wa.me/${product.business?.whatsapp || product.business?.phone}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar por WhatsApp
                </Link>
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
            </div>

            {product.business && (
              <div
                className={cn(
                  "flex flex-col gap-4 rounded-xl border-2 p-5 transition-all hover:shadow-lg",
                  isPremium
                    ? "border-yellow-500/40 bg-linear-to-br from-yellow-500/10 to-yellow-500/5"
                    : "border-border bg-muted/40",
                )}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 border-2">
                    <AvatarImage
                      src={product.business.logoUrl || "/placeholder.svg"}
                    />
                    <AvatarFallback className="font-bold text-lg">
                      {product.business.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-2">
                      <h3 className="truncate font-bold text-base">
                        {product.business.name}
                      </h3>
                      {(product.business.verified || isPremium) && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      )}
                    </div>
                    <p className="flex items-center gap-2 truncate text-muted-foreground text-sm">
                      <MapIcon className="h-4 w-4" />{" "}
                      {product.business.address || "Dirección no disponible"}
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <Button asChild className="w-full">
                    <Link href={`/comercio/${product.business.id}`}>
                      Ver perfil
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-12" />

        {similarProducts && similarProducts.length > 0 && (
          <div className="flex flex-col gap-4 px-8 lg:px-0">
            <h2 className="flex flex-col gap-2 font-bold text-2xl tracking-tight">
              Productos similares
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] place-items-center gap-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton loading state
function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-6 w-32 rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-gray-200" />
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-10 w-3/4 rounded bg-gray-200" />
            <div className="h-12 w-1/3 rounded bg-gray-200" />
          </div>
          <div className="h-32 rounded-xl bg-gray-200" />
          <div className="h-48 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
