"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountSettingsFormProps {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    // TODO: Add email validation
    if (!email.includes("@")) {
      toast.error("Email inválido");
      setLoading(false);
      return;
    }

    // TODO: Add name validation
    if (name.length < 3) {
      toast.error("Nombre inválido");
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement user update action
      toast.success("Información actualizada");
      router.refresh();
    } catch {
      toast.error("Error a actualizar la información");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" defaultValue={user.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user.email}
          disabled
        />
        <p className="text-muted-foreground text-sm">
          El email no se puede cambiar
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
