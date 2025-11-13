"use client";

import { MapPin, Search, SlidersHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const categories = [
  "Todos",
  "Alimentación",
  "Construcción",
  "Gastronomía",
  "Salud",
  "Belleza",
  "Tecnología",
  "Deportes",
  "Educación",
];

const businesses = [
  {
    id: 1,
    name: "Panadería El Sol",
    category: "Alimentación",
    image: "/bustling-bakery.png",
    rating: 4.8,
    reviews: 127,
    description: "Pan artesanal horneado diariamente con ingredientes frescos",
    location: "Centro, Calle Principal 123",
    open: true,
  },
  {
    id: 2,
    name: "Ferretería López",
    category: "Construcción",
    image: "/hardware-store.jpg",
    rating: 4.6,
    reviews: 89,
    description: "Todo para tu hogar y construcción desde 1985",
    location: "Zona Norte, Av. Industrial 456",
    open: true,
  },
  {
    id: 3,
    name: "Café Central",
    category: "Gastronomía",
    image: "/cozy-corner-cafe.png",
    rating: 4.9,
    reviews: 203,
    description: "El mejor café de especialidad y postres caseros",
    location: "Centro, Plaza Mayor",
    open: true,
  },
  {
    id: 4,
    name: "Farmacia San José",
    category: "Salud",
    image: "/pharmacy-storefront.png",
    rating: 4.7,
    reviews: 156,
    description: "Medicamentos, consultas y atención las 24 horas",
    location: "Sur, Av. Reforma 789",
    open: true,
  },
  {
    id: 5,
    name: "Gimnasio FitZone",
    category: "Deportes",
    image: "/modern-gym.png",
    rating: 4.5,
    reviews: 98,
    description: "Equipamiento completo y clases grupales",
    location: "Norte, Blvd. Deportivo 321",
    open: false,
  },
  {
    id: 6,
    name: "Salón Bella Vista",
    category: "Belleza",
    image: "/beauty-salon.png",
    rating: 4.8,
    reviews: 142,
    description: "Cortes, peinados y tratamientos de belleza",
    location: "Centro, Calle Juárez 654",
    open: true,
  },
  {
    id: 7,
    name: "TecnoStore",
    category: "Tecnología",
    image: "/electronics-store-interior.png",
    rating: 4.4,
    reviews: 87,
    description: "Laptops, celulares y accesorios tecnológicos",
    location: "Plaza Comercial, Local 12",
    open: true,
  },
  {
    id: 8,
    name: "Academia Idiomas Plus",
    category: "Educación",
    image: "/language-school.png",
    rating: 4.9,
    reviews: 175,
    description: "Clases de inglés, francés y alemán",
    location: "Centro, Calle Hidalgo 234",
    open: false,
  },
];

export default function ComerciosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("rating");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || business.category === selectedCategory;
    const matchesOpen = !showOpenOnly || business.open;
    const matchesRating = business.rating >= minRating;
    return matchesSearch && matchesCategory && matchesOpen && matchesRating;
  });

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviews - a.reviews;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <main className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">Explorar Comercios</h1>
        <p className="text-lg text-muted-foreground">
          Descubre negocios locales y apoya a tu comunidad
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar comercios, ubicaciones..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Mejor valorados</SelectItem>
            <SelectItem value="reviews">Más opiniones</SelectItem>
            <SelectItem value="name">Nombre (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Refina tu búsqueda de comercios
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="open"
                  checked={showOpenOnly}
                  onCheckedChange={(checked) =>
                    setShowOpenOnly(checked as boolean)
                  }
                />
                <Label htmlFor="open">Solo comercios abiertos</Label>
              </div>
              <div>
                <Label>Calificación mínima</Label>
                <Select
                  value={minRating.toString()}
                  onValueChange={(value) => setMinRating(Number(value))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Todas</SelectItem>
                    <SelectItem value="3">3+ estrellas</SelectItem>
                    <SelectItem value="4">4+ estrellas</SelectItem>
                    <SelectItem value="4.5">4.5+ estrellas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowOpenOnly(false);
                    setMinRating(0);
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Category Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer px-4 py-2"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Results Count */}
      <p className="mb-4 text-muted-foreground text-sm">
        Mostrando {sortedBusinesses.length} de {businesses.length} comercios
      </p>

      {/* Businesses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedBusinesses.map((business) => (
          <Link key={business.id} href={`/comercio/${business.id}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
              <div className="relative aspect-video overflow-hidden">
                <ImageWithSkeleton
                  src={business.image || "/placeholder.svg"}
                  alt={business.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
                {business.open && (
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    Abierto
                  </Badge>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">
                      {business.name}
                    </CardTitle>
                    <CardDescription>{business.category}</CardDescription>
                  </div>
                  <Badge variant="secondary">{business.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-2 text-muted-foreground text-sm">
                  {business.description}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{business.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{business.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    ({business.reviews} opiniones)
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {sortedBusinesses.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            No se encontraron comercios con los filtros seleccionados
          </p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Todos");
              setShowOpenOnly(false);
              setMinRating(0);
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </main>
  );
}
