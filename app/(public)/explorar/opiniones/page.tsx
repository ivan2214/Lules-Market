"use client";

import { Clock, MessageSquare, Search, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  "Todas",
  "Servicios",
  "Productos",
  "Comercios",
  "Recomendaciones",
  "Preguntas",
];

const opinions = [
  {
    id: 1,
    author: "María González",
    avatar: "/diverse-woman-avatar.png",
    question: "¿Alguien sabe dónde venden plantas de interior a buen precio?",
    content:
      "Estoy buscando plantas para decorar mi departamento, idealmente cerca de la zona centro.",
    answers: 12,
    likes: 24,
    time: "Hace 2 horas",
    category: "Productos",
  },
  {
    id: 2,
    author: "Carlos Ramírez",
    avatar: "/man-avatar.png",
    question: "Busco un buen mecánico en la zona norte",
    content:
      "Necesito hacer un servicio completo a mi auto, ¿alguna recomendación de talleres confiables?",
    answers: 8,
    likes: 15,
    time: "Hace 5 horas",
    category: "Servicios",
  },
  {
    id: 3,
    author: "Ana Torres",
    avatar: "/woman-avatar-2.png",
    question:
      "¿Recomendaciones de veterinarios que atiendan los fines de semana?",
    content: "Mi perrito necesita revisión y solo tengo tiempo los sábados.",
    answers: 15,
    likes: 32,
    time: "Hace 1 día",
    category: "Servicios",
  },
  {
    id: 4,
    author: "Juan Pérez",
    avatar: "/man-avatar.png",
    question: "¿Cuál es la mejor panadería para comprar pan artesanal?",
    content:
      "Quiero probar pan de masa madre recién horneado, ¿dónde lo consigo?",
    answers: 20,
    likes: 45,
    time: "Hace 2 días",
    category: "Recomendaciones",
  },
  {
    id: 5,
    author: "Laura Martínez",
    avatar: "/diverse-woman-avatar.png",
    question: "¿Dónde compran sus materiales de papelería?",
    content:
      "Busco una papelería con buenos precios y variedad para material escolar.",
    answers: 6,
    likes: 18,
    time: "Hace 3 días",
    category: "Comercios",
  },
  {
    id: 6,
    author: "Roberto Silva",
    avatar: "/man-avatar-3.png",
    question: "Opiniones sobre el nuevo café que abrió en el centro",
    content: "Vi que abrieron un café nuevo cerca del parque, ¿alguien ya fue?",
    answers: 14,
    likes: 28,
    time: "Hace 4 días",
    category: "Recomendaciones",
  },
];

export default function OpinionesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState("recent");

  const filteredOpinions = opinions.filter((opinion) => {
    const matchesSearch =
      opinion.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opinion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opinion.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todas" || opinion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedOpinions = [...filteredOpinions].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes;
      case "answers":
        return b.answers - a.answers;
      default:
        return 0;
    }
  });

  return (
    <main className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">Opiniones de la Comunidad</h1>
        <p className="text-lg text-muted-foreground">
          Pregunta, comparte experiencias y ayuda a otros usuarios
        </p>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar opiniones, preguntas..."
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
            <SelectItem value="popular">Más populares</SelectItem>
            <SelectItem value="answers">Más respondidas</SelectItem>
          </SelectContent>
        </Select>

        <Button className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Nueva pregunta
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="mb-6"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Results Count */}
      <p className="mb-4 text-muted-foreground text-sm">
        Mostrando {sortedOpinions.length} de {opinions.length} opiniones
      </p>

      {/* Opinions List */}
      <div className="space-y-4">
        {sortedOpinions.map((opinion) => (
          <Card key={opinion.id} className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={opinion.avatar || "/placeholder.svg"}
                    alt={opinion.author}
                  />
                  <AvatarFallback>{opinion.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="font-semibold">{opinion.author}</p>
                    <Badge variant="outline" className="text-xs">
                      {opinion.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Clock className="h-3 w-3" />
                    {opinion.time}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="mb-2 font-semibold text-lg">{opinion.question}</h3>
              <p className="text-muted-foreground text-sm">{opinion.content}</p>
            </CardContent>
            <CardFooter className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {opinion.answers} respuestas
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                {opinion.likes}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto bg-transparent"
              >
                Responder
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedOpinions.length === 0 && (
        <div className="py-12 text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            No se encontraron opiniones con los filtros seleccionados
          </p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Todas");
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </main>
  );
}
