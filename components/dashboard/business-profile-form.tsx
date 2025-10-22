"use client";

import type { BusinessDTO } from "@/app/data/business/business.dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Uploader } from "../uploader/uploader";

const CATEGORIES = [
  "Restaurante",
  "Cafetería",
  "Tienda de Ropa",
  "Supermercado",
  "Farmacia",
  "Peluquería",
  "Gimnasio",
  "Librería",
  "Ferretería",
  "Panadería",
  "Otro",
];

interface BusinessProfileFormProps {
  business: BusinessDTO;
}

export function BusinessProfileForm({ business }: BusinessProfileFormProps) {
  return (
    <form className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Negocio *</Label>
          <Input id="name" name="name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría *</Label>
          <Select
            name="category"
            defaultValue={business.category || ""}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={business.description || ""}
          placeholder="Describe tu negocio..."
          rows={4}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            name="address"
            defaultValue={business.address || ""}
            placeholder="Calle 123, Ciudad"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={business.phone || ""}
            placeholder="+54 11 1234-5678"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={business.email || ""}
            placeholder="contacto@negocio.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Sitio Web</Label>
          <Input
            id="website"
            name="website"
            type="url"
            defaultValue={business.website || ""}
            placeholder="https://minegocio.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hours">Horarios de Atención</Label>
        <Textarea
          id="hours"
          name="hours"
          defaultValue={business.hours || ""}
          placeholder="Lunes a Viernes: 9:00 - 18:00&#10;Sábados: 10:00 - 14:00"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Redes Sociales</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              defaultValue={business.whatsapp || ""}
              placeholder="+54 11 1234-5678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              name="instagram"
              defaultValue={business.instagram || ""}
              placeholder="@minegocio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              name="facebook"
              defaultValue={business.facebook || ""}
              placeholder="facebook.com/minegocio"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Imágenes</h3>
        <div className="flex items-center justify-evenly">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <Uploader folder="busines" variant="avatar" onChange={() => {}} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Imagen de Portada</Label>
            <Uploader folder="busines" variant="compact" onChange={() => {}} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit">
          {/* {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
