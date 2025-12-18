import {
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Share2,
  Store,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductSchema } from "@/app/shared/components/structured-data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/shared/components/ui/avatar";
import { Badge } from "@/app/shared/components/ui/badge";
import { Button } from "@/app/shared/components/ui/button";
import { Separator } from "@/app/shared/components/ui/separator";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { mainImage } from "@/utils/main-image";
import { ProductCard } from "../../_components/product-card";
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
  const { products } = await orpc.products.listAllProducts();
  if (!products.length) return [{ id: "static-fallback" }];
  return products.map((product) => ({ id: product.id }));
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

  // Fixed WhatsApp Message
  const whatsappMessage = encodeURIComponent(
    `Hola ${product.business?.name}, vi su producto "${product.name}" en Lules Market y me interesa.`,
  );

  return (
    <div className="min-h-screen bg-background pb-12">
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
          url: `https://lules-market.vercel.app/comercio/${product.business?.id}`,
        }}
      />

      {/* Breadcrumbs */}
      <div className="border-b bg-muted/20">
        <div className="container px-4 py-4">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            <Link href="/" className="hover:text-primary">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/explorar/productos" className="hover:text-primary">
              Productos
            </Link>
            {product.category && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={`/explorar/productos?category=${product.category.value}`}
                  className="hover:text-primary"
                >
                  {product.category.label}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Images */}
          <div className="lg:col-span-7">
            <ProductImages images={product.images} name={product.name} />
          </div>

          {/* Right Column: Key Details & Actions */}
          <div className="space-y-8 lg:col-span-5">
            <div>
              <div className="mb-4 flex items-center gap-2">
                {product.category && (
                  <Badge variant="secondary" className="font-medium">
                    {product.category.label}
                  </Badge>
                )}
                {isPremium && (
                  <Badge className="border-none bg-yellow-500 text-white hover:bg-yellow-600">
                    Destacado
                  </Badge>
                )}
              </div>
              <h1 className="mb-2 font-bold text-3xl tracking-tight md:text-4xl">
                {product.name}
              </h1>
              {product.business && (
                <Link
                  href={`/comercio/${product.business.id}`}
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Store className="h-4 w-4" />
                  <span className="font-medium underline decoration-border underline-offset-4 hover:decoration-primary">
                    {product.business.name}
                  </span>
                </Link>
              )}
            </div>

            <Separator />

            <div>
              <div className="mb-2 font-bold text-4xl text-primary">
                {formatCurrency(product.price || 0, "ARS")}
              </div>
              <p className="text-muted-foreground text-sm">
                Precio sujeto a modificaciones. Consultar vigencia.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="h-12 w-full gap-2 text-base shadow-lg shadow-primary/20"
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
              <Button variant="outline" size="lg" className="h-12 w-full gap-2">
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
            </div>

            {/* Business Short Card */}
            {product.business && (
              <div
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  isPremium
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "bg-muted/30",
                )}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={product.business.logo?.url} />
                    <AvatarFallback>{product.business.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold">
                        {product.business.name}
                      </h3>
                      {(product.business.verified || isPremium) && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      )}
                    </div>
                    <p className="truncate text-muted-foreground text-xs">
                      {product.business.address || "Dirección no disponible"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
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

        {/* Detailed Description */}
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="mb-6 font-bold text-2xl">Detalles del producto</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="whitespace-pre-line text-lg text-muted-foreground leading-relaxed">
                {product.description ||
                  "El vendedor no ha proporcionado una descripción detallada para este producto."}
              </p>
            </div>
          </div>

          {/* Mobile-friendly sidebar content could happen here if needed */}
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-bold text-2xl">Productos similares</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
