import {
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Share2,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { orpc } from "@/lib/orpc";
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
import { formatCurrency } from "@/shared/utils/format";
import { mainImage } from "@/shared/utils/main-image";
import { ProductImages } from "./_components/product-images";
import { ProductViewTracker } from "./_components/product-view-tracker";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { product } = await orpc.products.getProductById({ id });

  if (!product) {
    notFound();
  }

  const ogImages = product.images?.map((image) => ({
    url: image.url,
    width: 1200,
    height: 630,
    alt: product.name,
  }));

  const description = product.description
    ? `${product.description.substring(0, 155)}${product.description.length > 155 ? "..." : ""}`
    : `Compra ${product.name} en Lules Market.`;

  return {
    title: `${product.name} | ${product.business?.name}`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: ogImages?.length ? ogImages : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    // Intentar obtener la lista de productos
    const { products } = await orpc.products.listAllProducts();

    // Si hay productos, generar params para cada uno
    if (products && products.length > 0) {
      return products.map((product) => ({ id: product.id }));
    }

    // Si no hay productos, retornar array vacío
    return [];
  } catch (error) {
    // Log del error para debugging
    console.error("[generateStaticParams] Error fetching products:", error);

    // Retornar array vacío para permitir generación dinámica
    return [];
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const { product } = await orpc.products.getProductById({ id });

  if (!product) {
    notFound();
  }

  // Fetch Similar Products
  const similarProducts = product.category
    ? await orpc.products.getSimilarProducts({
        id: product.id,
        categoryId: product.category.id,
      })
    : [];

  const planType = product.business?.currentPlan?.plan?.type || "FREE";
  const isPremium = planType === "PREMIUM";
  const whatsappMessage = encodeURIComponent(
    `Hola ${product.business?.name}, vi su producto "${product.name}" en Lules Market y me interesa.`,
  );

  return (
    <div className="min-h-screen bg-background pb-12">
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
          url: `https://lules-market.vercel.app/producto/${product.id}`,
        }}
        url={`https://lules-market.vercel.app/producto/${product.id}`}
      />
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

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <ProductImages images={product.images} name={product.name} />
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
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
              <h1 className="mb-3 font-bold text-3xl leading-tight tracking-tight md:text-4xl">
                {product.name}
              </h1>
              <div className="prose prose-neutral dark:prose-invert mb-3 max-w-none">
                <p className="whitespace-pre-line text-base text-muted-foreground leading-relaxed">
                  {product.description ||
                    "El vendedor no ha proporcionado una descripción detallada para este producto."}
                </p>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg bg-muted/50 p-5">
              <div className="mb-1.5 font-bold text-4xl text-primary md:text-5xl">
                {formatCurrency(product.price || 0, "ARS")}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Precio sujeto a modificaciones. Consultar vigencia.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="h-14 w-full gap-2 font-semibold text-base shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 hover:shadow-xl"
                asChild
              >
                <a
                  href={`https://wa.me/${product.business?.whatsapp || product.business?.phone}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar por WhatsApp
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full gap-2 bg-transparent font-semibold"
              >
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
            </div>

            {product.business && (
              <div
                className={cn(
                  "rounded-xl border-2 p-5 transition-all hover:shadow-lg",
                  isPremium
                    ? "border-yellow-500/40 bg-linear-to-br from-yellow-500/10 to-yellow-500/5"
                    : "border-border bg-muted/40",
                )}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2">
                    <AvatarImage
                      src={product.business.logo?.url || "/placeholder.svg"}
                    />
                    <AvatarFallback className="font-bold text-lg">
                      {product.business.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-bold text-base">
                        {product.business.name}
                      </h3>
                      {(product.business.verified || isPremium) && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-muted-foreground text-sm">
                      {product.business.address || "Dirección no disponible"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 font-semibold"
                    asChild
                  >
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

        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 font-bold text-2xl tracking-tight">
              Productos similares
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
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
