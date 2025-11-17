import { startOfMonth, subMonths } from "date-fns";
import { ArrowRight, MessageSquare, Package, Star, Store } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductPublicCard } from "@/components/public/product-public-card";
import { PublicBusinessCard } from "@/components/public/public-business-card";
import { PublicPostCard } from "@/components/public/public-post-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";

// Metadata para SEO
export const metadata: Metadata = {
  title: "Lules Market - Tu Vitrina Digital para Comercios Locales",
  description:
    "Conecta con clientes de tu zona. Publica tus productos, aumenta tu visibilidad y haz crecer tu negocio con nuestra plataforma diseñada para comercios locales.",
  keywords:
    "comercios locales, vitrina digital, productos locales, negocios, emprendedores, marketplace",
  openGraph: {
    title: "Lules Market - Tu Vitrina Digital para Comercios Locales",
    description:
      "Conecta con clientes de tu zona. Publica tus productos, aumenta tu visibilidad y haz crecer tu negocio.",
    url: "https://lules-market.vercel.app",
    siteName: "Lules Market",
    images: [
      {
        url: "https://lules-market.vercel.app/logo.webp",
        width: 1200,
        height: 630,
        alt: "Lules Market - Plataforma para comercios locales",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lules Market - Tu Vitrina Digital para Comercios Locales",
    description:
      "Conecta con clientes de tu zona. Publica tus productos, aumenta tu visibilidad y haz crecer tu negocio.",
    images: ["https://lules-market.vercel.app/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://lules-market.vercel.app",
  },
};

export default async function HomePage() {
  // 🔥 Todo en una sola transacción
  const [featuredBusinesses, recentProducts, recentPosts] =
    await prisma.$transaction([
      // 🔥 BUSINESS DESTACADOS (mejores valorados)
      prisma.business.findMany({
        where: { isActive: true, isBanned: false },
        include: {
          reviews: {
            include: {
              author: {
                include: {
                  avatar: true,
                },
              },
            },
          },
          category: true,
          logo: true,
        },
        orderBy: {
          reviews: { _count: "desc" },
        },
        take: 6,
      }),

      // 🔥 PRODUCTOS RECIENTES
      prisma.product.findMany({
        where: { active: true, isBanned: false },
        include: {
          images: true,
          business: true,
          category: true,
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),

      // 🔥 POSTS RECIENTES
      prisma.post.findMany({
        where: { content: { not: "" } },
        include: {
          author: { include: { avatar: true } },
          answers: { include: { author: { include: { avatar: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

  const now = new Date();
  const startThisMonth = startOfMonth(now);
  const startLastMonth = startOfMonth(subMonths(now, 1));
  const endLastMonth = startThisMonth;

  const [
    // Comercios activos
    activeBusinessesTotal,
    activeBusinessesLastMonth,
    // Productos publicados
    productsTotal,
    productsLastMonth,
    // Opiniones compartidas
    reviewsTotal,
    reviewsLastMonth,
    // Valoración promedio
    avgRatingObj,
    avgRatingLastMonthObj,
  ] = await prisma.$transaction([
    prisma.business.count({ where: { isActive: true, isBanned: false } }),
    prisma.business.count({
      where: {
        isActive: true,
        isBanned: false,
        createdAt: { gte: startLastMonth, lt: endLastMonth },
      },
    }),

    prisma.product.count({ where: { active: true, isBanned: false } }),
    prisma.product.count({
      where: {
        active: true,
        isBanned: false,
        createdAt: { gte: startLastMonth, lt: endLastMonth },
      },
    }),

    prisma.review.count({ where: { isHidden: false } }),
    prisma.review.count({
      where: {
        isHidden: false,
        createdAt: { gte: startLastMonth, lt: endLastMonth },
      },
    }),

    prisma.review.aggregate({
      _avg: { rating: true },
      where: { isHidden: false },
    }),
    prisma.review.aggregate({
      _avg: { rating: true },
      where: {
        isHidden: false,
        createdAt: { gte: startLastMonth, lt: endLastMonth },
      },
    }),
  ]);

  // Función para calcular tendencia %
  function calcTrend(current: number, previous: number) {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  }

  const stats = {
    businesses: {
      value: activeBusinessesTotal,
      trend: calcTrend(activeBusinessesTotal, activeBusinessesLastMonth),
    },
    products: {
      value: productsTotal,
      trend: calcTrend(productsTotal, productsLastMonth),
    },
    reviews: {
      value: reviewsTotal,
      trend: calcTrend(reviewsTotal, reviewsLastMonth),
    },
    avgRating: {
      value: avgRatingObj._avg.rating ?? 0,
      trend:
        (((avgRatingObj._avg.rating ?? 0) -
          (avgRatingLastMonthObj._avg.rating ?? 0)) *
          100) /
        5, // opcional: % cambio de rating sobre 5
    },
  };
  return (
    <main className="container px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-8 md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-balance font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
            Conecta con tu comunidad local
          </h1>
          <p className="mb-8 text-balance text-lg text-muted-foreground md:text-xl">
            Descubre productos, servicios y comercios cerca de ti. Comparte
            opiniones y encuentra lo que necesitas.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/explorar/comercios">
                Explorar Comercios
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/explorar/productos">Ver Productos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">
              Comercios Activos
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.businesses.value}</div>
            <p className="text-muted-foreground text-xs">
              {stats.businesses.trend.toFixed(2)}% este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">
              Productos Publicados
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.products.value}</div>
            <p className="text-muted-foreground text-xs">
              {stats.products.trend.toFixed(2)}% este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">
              Opiniones Compartidas
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.reviews.value}</div>
            <p className="text-muted-foreground text-xs">
              {stats.reviews.trend.toFixed(2)}% este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">
              Valoración Promedio
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {stats.avgRating.value.toFixed(2)}
            </div>
            <p className="text-muted-foreground text-xs">De 5 estrellas</p>
          </CardContent>
        </Card>
      </section>

      {/* Featured Businesses */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-3xl">Comercios Destacados</h2>
            <p className="text-muted-foreground">
              Los mejores negocios de tu comunidad
            </p>
          </div>
          <Button variant="ghost" className="gap-2" asChild>
            <Link href="/explorar/comercios">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBusinesses.map((business) => (
            <PublicBusinessCard key={business.id} business={business} />
          ))}
        </div>
      </section>

      {/* Recent Products */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-3xl">Productos Recientes</h2>
            <p className="text-muted-foreground">
              Últimos productos publicados
            </p>
          </div>
          <Button variant="ghost" className="gap-2" asChild>
            <Link href="/explorar/productos">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/*   {recentProducts.map((product) => (
            <Link key={product.id} href={`/producto/${product.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-square overflow-hidden">
                  <ImageWithSkeleton
                    src={mainImage(product.images) || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <Badge variant="outline" className="text-xs">
                      {product.category?.label}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2 text-base">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {product.business?.name || "Anónimo"}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0">
                  <div className="flex w-full items-center justify-between">
                    <p className="font-bold text-primary text-xl">
                      {product.price}
                    </p>
                    <Button size="sm" variant="outline">
                      Ver
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))} */}
          {recentProducts.map((product) => (
            <ProductPublicCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recent posts */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-3xl">Posts Recientes</h2>
            <p className="text-muted-foreground">
              La comunidad pregunta y responde
            </p>
          </div>
          <Button variant="ghost" className="gap-2" asChild>
            <Link href="/explorar/posts">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <PublicPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-2xl bg-primary p-8 text-primary-foreground md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-balance font-bold text-3xl md:text-4xl">
            ¿Tienes un negocio?
          </h2>
          <p className="mb-8 text-balance text-lg opacity-90">
            Únete a nuestra comunidad de comercios locales y llega a más
            clientes en tu zona.
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            Registrar mi comercio
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </main>
  );
}
