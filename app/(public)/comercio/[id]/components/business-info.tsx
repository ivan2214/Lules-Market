"use client";

import {
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
  Star,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import type { BusinessDTO } from "@/app/data/business/business.dto";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for business details
const businessData: Record<string, any> = {
  "1": {
    id: 1,
    name: "Panadería El Sol",
    category: "Alimentación",
    images: [
      "/bustling-bakery.png",
      "/cozy-bakery.png",
      "/fresh-bread-display.jpg",
      "/bakery-counter.jpg",
    ],
    rating: 4.8,
    reviews: 127,
    description:
      "Pan artesanal horneado diariamente con ingredientes frescos y naturales. Más de 20 años sirviendo a la comunidad con las mejores recetas tradicionales.",
    longDescription:
      "Somos una panadería familiar con más de 20 años de experiencia en la elaboración de pan artesanal. Utilizamos ingredientes de la más alta calidad y recetas tradicionales que han pasado de generación en generación. Nuestro compromiso es ofrecer productos frescos todos los días.",
    location: "Centro, Calle Principal 123",
    phone: "+52 55 1234 5678",
    email: "contacto@panaderiaelsol.com",
    website: "www.panaderiaelsol.com",
    hours: {
      "Lunes - Viernes": "7:00 AM - 8:00 PM",
      Sábado: "7:00 AM - 9:00 PM",
      Domingo: "8:00 AM - 6:00 PM",
    },
    open: true,
    features: [
      "Entrega a domicilio",
      "Pedidos por WhatsApp",
      "Estacionamiento",
      "WiFi gratis",
    ],
  },
  "2": {
    id: 2,
    name: "Ferretería López",
    category: "Construcción",
    images: [
      "/hardware-store.jpg",
      "/hardware-tools.jpg",
      "/construction-materials-variety.png",
    ],
    rating: 4.6,
    reviews: 89,
    description: "Todo para tu hogar y construcción desde 1985",
    longDescription:
      "Ferretería familiar con más de 35 años en el mercado. Ofrecemos una amplia variedad de herramientas, materiales de construcción y artículos para el hogar.",
    location: "Zona Norte, Av. Industrial 456",
    phone: "+52 55 2345 6789",
    email: "ventas@ferreterialopez.com",
    website: "www.ferreterialopez.com",
    hours: {
      "Lunes - Sábado": "8:00 AM - 7:00 PM",
      Domingo: "9:00 AM - 2:00 PM",
    },
    open: true,
    features: ["Asesoría técnica", "Entrega a domicilio", "Crédito disponible"],
  },
  "3": {
    id: 3,
    name: "Café Central",
    category: "Gastronomía",
    images: [
      "/cozy-corner-cafe.png",
      "/cozy-coffee-shop.png",
      "/latte-art.jpg",
    ],
    rating: 4.9,
    reviews: 203,
    description: "El mejor café de especialidad y postres caseros",
    longDescription:
      "Café de especialidad en el corazón de la ciudad. Ofrecemos granos seleccionados de diferentes regiones, tostados artesanalmente, y una variedad de postres caseros.",
    location: "Centro, Plaza Mayor",
    phone: "+52 55 3456 7890",
    email: "hola@cafecentral.com",
    website: "www.cafecentral.com",
    hours: {
      "Lunes - Domingo": "7:00 AM - 10:00 PM",
    },
    open: true,
    features: ["WiFi gratis", "Terraza", "Eventos privados", "Pet friendly"],
  },
};

const products = [
  {
    id: 1,
    title: "Pan de masa madre",
    price: 85,
    image: "/rustic-sourdough-loaf.png",
  },
  {
    id: 2,
    title: "Croissant de mantequilla",
    price: 35,
    image: "/golden-croissant.png",
  },
  {
    id: 3,
    title: "Concha tradicional",
    price: 15,
    image: "/concha-bread.jpg",
  },
  {
    id: 4,
    title: "Pan integral",
    price: 65,
    image: "/whole-wheat-bread.png",
  },
];

const customerReviews = [
  {
    id: 1,
    author: "María González",
    avatar: "/diverse-woman-avatar.png",
    rating: 5,
    date: "Hace 3 días",
    comment:
      "El mejor pan de la zona. Siempre fresco y delicioso. El personal es muy amable y el lugar está muy limpio.",
    helpful: 12,
  },
  {
    id: 2,
    author: "Carlos Ramírez",
    avatar: "/man-avatar.png",
    rating: 5,
    date: "Hace 1 semana",
    comment:
      "Las conchas son increíbles! Me recuerdan a mi infancia. Los precios son justos y la calidad excepcional.",
    helpful: 8,
  },
  {
    id: 3,
    author: "Ana Torres",
    avatar: "/woman-avatar-2.png",
    rating: 4,
    date: "Hace 2 semanas",
    comment:
      "Muy buena panadería. El pan de masa madre es espectacular. Solo le falta más variedad de pasteles.",
    helpful: 5,
  },
  {
    id: 4,
    author: "Juan Pérez",
    avatar: "/man-avatar-3.png",
    rating: 5,
    date: "Hace 3 semanas",
    comment:
      "Excelente servicio y productos de primera calidad. Compro aquí todas las semanas.",
    helpful: 15,
  },
];

const ratingDistribution = [
  { stars: 5, count: 95, percentage: 75 },
  { stars: 4, count: 20, percentage: 16 },
  { stars: 3, count: 8, percentage: 6 },
  { stars: 2, count: 3, percentage: 2 },
  { stars: 1, count: 1, percentage: 1 },
];

type BusinessInfoProps = {
  business: BusinessDTO;
  similarBusinesses?: {
    id: string;
    name: string;
    logo: {
      key: string;
      url: string;
    } | null;
    _count: {
      products: number;
    };
  }[];
};

export const BusinessInfo: React.FC<BusinessInfoProps> = ({
  business,
  similarBusinesses,
}) => {
  return (
    <main className="container px-4 py-8">
      {/* Hero Section with Image Carousel */}
      <div className="mb-8">
        <div className="mx-auto max-w-5xl">
          <div className="w-full">
            <div className="aspect-video overflow-hidden rounded-2xl">
              <ImageWithSkeleton
                src={business.coverImage?.url || "/placeholder.svg"}
                alt={`${business.name} - Imagen principal`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Header */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="font-bold text-4xl">{business.name}</h1>
                {/*   {business.open && (
                  <Badge className="bg-green-500">Abierto ahora</Badge>
                )} */}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{business.category?.label}</Badge>
                {business.tags.slice(0, 2).map((feature: string) => (
                  <Badge key={feature} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-2xl">{business.rating}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Link
              href="#reviews"
              className="text-muted-foreground text-sm hover:underline"
            >
              {business.reviews?.length} opiniones
            </Link>
          </div>

          <p className="text-lg text-muted-foreground">
            {business.description}
          </p>
        </div>

        {/* Contact Card */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Dirección</p>
                <p className="text-muted-foreground text-sm">
                  {business.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Teléfono</p>
                <a
                  href={`tel:${business.phone}`}
                  className="text-primary text-sm hover:underline"
                >
                  {business.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <a
                  href={`mailto:${business.email}`}
                  className="text-primary text-sm hover:underline"
                >
                  {business.email}
                </a>
              </div>
            </div>
            {business.website && (
              <div className="flex items-start gap-3">
                <ExternalLink className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Sitio web</p>
                  <a
                    href={`https://${business.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline"
                  >
                    {business.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button className="w-full">
              <Phone className="mr-2 h-4 w-4" />
              Llamar ahora
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <MessageSquare className="mr-2 h-4 w-4" />
              Enviar mensaje
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">Acerca de</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="reviews">Opiniones</TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acerca del negocio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {business.description}
              </p>
              <div>
                <h3 className="mb-3 font-semibold">
                  Características destacadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((feature: string) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                <ImageWithSkeleton
                  src="/map-location.png"
                  alt="Mapa de ubicación"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-4 flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="mt-1 h-4 w-4" />
                {business.address}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Productos Destacados</CardTitle>
              <CardDescription>
                Algunos de nuestros productos más populares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <ImageWithSkeleton
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">
                        {product.title}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0">
                      <div className="flex w-full items-center justify-between">
                        <p className="font-bold text-primary text-xl">
                          ${product.price}
                        </p>
                        <Button size="sm" variant="outline">
                          Ver
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" id="reviews" className="space-y-6">
          {/* Rating Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Calificaciones y opiniones</CardTitle>
              <CardDescription>
                {business.reviews?.length} opiniones de clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center space-y-2 border-border border-r">
                  <div className="font-bold text-6xl">{business.rating}</div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Basado en {business.reviews?.length} opiniones
                  </p>
                </div>
                <div className="space-y-3">
                  {ratingDistribution.map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-3">
                      <div className="flex w-12 items-center gap-1">
                        <span className="font-medium text-sm">
                          {rating.stars}
                        </span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Progress value={rating.percentage} className="flex-1" />
                      <span className="w-12 text-right text-muted-foreground text-sm">
                        {rating.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Escribir una opinión</Button>
            </CardFooter>
          </Card>

          {/* Individual Reviews */}
          <div className="space-y-4">
            {customerReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.author}
                        />
                        <AvatarFallback>{review.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.author}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {review.comment}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Útil ({review.helpful})
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};
