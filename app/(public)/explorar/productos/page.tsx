"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
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
import { Slider } from "@/components/ui/slider";

const categories = [
  "Todos",
  "Tecnología",
  "Muebles",
  "Herramientas",
  "Electrodomésticos",
  "Ropa",
  "Deportes",
  "Libros",
  "Juguetes",
];

const products = [
  {
    id: 1,
    title: "Silla de oficina ergonómica",
    price: 12500,
    business: "Muebles del Hogar",
    image: "/ergonomic-office-chair.png",
    category: "Muebles",
    description: "Silla cómoda con soporte lumbar",
  },
  {
    id: 2,
    title: "Laptop Dell Inspiron 15",
    price: 35999,
    business: "TecnoStore",
    image: "/modern-laptop-workspace.png",
    category: "Tecnología",
    description: "Intel Core i7, 16GB RAM, SSD 512GB",
  },
  {
    id: 3,
    title: "Juego de herramientas 50 piezas",
    price: 2850,
    business: "Ferretería López",
    image: "/assorted-tool-set.png",
    category: "Herramientas",
    description: "Kit completo para el hogar",
  },
  {
    id: 4,
    title: "Cafetera Nespresso",
    price: 4200,
    business: "Electrodomésticos MX",
    image: "/modern-coffee-machine.png",
    category: "Electrodomésticos",
    description: "Cafetera de cápsulas automática",
  },
  {
    id: 5,
    title: "Smart TV Samsung 55 pulgadas",
    price: 15999,
    business: "TecnoStore",
    image: "/smart-tv-living-room.png",
    category: "Tecnología",
    description: "4K UHD, HDR, Smart TV",
  },
  {
    id: 6,
    title: "Sofá 3 plazas",
    price: 18500,
    business: "Muebles del Hogar",
    image: "/modern-sofa.png",
    category: "Muebles",
    description: "Tapizado en tela gris, muy cómodo",
  },
  {
    id: 7,
    title: "Taladro inalámbrico Bosch",
    price: 3200,
    business: "Ferretería López",
    image: "/cordless-drill.png",
    category: "Herramientas",
    description: "20V, incluye 2 baterías",
  },
  {
    id: 8,
    title: "Licuadora de alta potencia",
    price: 2100,
    business: "Electrodomésticos MX",
    image: "/blender-3d-scene.png",
    category: "Electrodomésticos",
    description: "1200W, 5 velocidades",
  },
];

export default function ProductosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("recent");
  const [priceRange, setPriceRange] = useState([0, 50000]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.business.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <main className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">Explorar Productos</h1>
        <p className="text-lg text-muted-foreground">
          Descubre productos de comercios locales cerca de ti
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
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
            <SelectItem value="recent">Más recientes</SelectItem>
            <SelectItem value="price-asc">Precio: Menor a mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a menor</SelectItem>
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
                Refina tu búsqueda de productos
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div>
                <Label>Rango de precio</Label>
                <div className="mt-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000}
                    step={1000}
                    className="mb-2"
                  />
                  <div className="flex items-center justify-between text-muted-foreground text-sm">
                    <span>${priceRange[0].toLocaleString()}</span>
                    <span>${priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <Button
                  className="w-full"
                  onClick={() => setPriceRange([0, 50000])}
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
        Mostrando {sortedProducts.length} de {products.length} productos
      </p>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden transition-all hover:shadow-lg"
          >
            <div className="aspect-square overflow-hidden">
              <ImageWithSkeleton
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
              </div>
              <CardTitle className="line-clamp-2 text-base">
                {product.title}
              </CardTitle>
              <CardDescription className="text-xs">
                {product.business}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="line-clamp-2 text-muted-foreground text-sm">
                {product.description}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="flex w-full items-center justify-between">
                <p className="font-bold text-primary text-xl">
                  ${product.price.toLocaleString()}
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/producto/${product.id}`}>Ver</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            No se encontraron productos con los filtros seleccionados
          </p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Todos");
              setPriceRange([0, 50000]);
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </main>
  );
}
