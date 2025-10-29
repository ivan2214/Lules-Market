"use client";

import { Check, Pencil, Plus, Power } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { mockPlans } from "@/lib/data/mock-data";
import type { Plan, PlanType } from "@/lib/types/admin";

export default function PlansPage() {
  const [plans, setPlans] = useState(mockPlans);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [toggleAlertOpen, setToggleAlertOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleToggleActive = (planId: string) => {
    setPlans(
      plans.map((p) => (p.id === planId ? { ...p, isActive: !p.isActive } : p)),
    );
    setToggleAlertOpen(false);
    console.log("Toggle activo plan:", planId);
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedPlan) {
      setPlans(plans.map((p) => (p.id === selectedPlan.id ? selectedPlan : p)));
      console.log("Editar plan:", selectedPlan);
    }
    setIsEditDialogOpen(false);
  };

  const handleCreate = () => {
    console.log("Crear nuevo plan");
    setIsCreateDialogOpen(false);
  };

  const columns = [
    {
      key: "name",
      label: "Plan",
      render: (plan: Plan) => (
        <div>
          <div className="font-medium">{plan.name}</div>
          <Badge variant="outline" className="mt-1">
            {plan.type}
          </Badge>
        </div>
      ),
    },
    {
      key: "description",
      label: "Descripción",
      render: (plan: Plan) => (
        <span className="text-muted-foreground text-sm">
          {plan.description}
        </span>
      ),
    },
    {
      key: "price",
      label: "Precio",
      render: (plan: Plan) => (
        <span className="font-medium">
          {plan.price === 0 ? "Gratis" : `$${(plan.price / 100).toFixed(2)}`}
        </span>
      ),
    },
    {
      key: "limits",
      label: "Límites",
      render: (plan: Plan) => (
        <div className="text-sm">
          <div>
            Productos:{" "}
            {plan.maxProducts === -1 ? "Ilimitados" : plan.maxProducts}
          </div>
          <div className="text-muted-foreground">
            Imágenes: {plan.maxImages === -1 ? "Ilimitadas" : plan.maxImages}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (plan: Plan) => (
        <Badge variant={plan.isActive ? "outline" : "secondary"}>
          {plan.isActive ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (plan: Plan) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedPlan(plan);
              setToggleAlertOpen(true);
            }}
          >
            <Power className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Gestión de Planes
          </h1>
          <p className="text-muted-foreground">
            Administra los planes de suscripción disponibles
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Plan</DialogTitle>
              <DialogDescription>
                Define los parámetros del nuevo plan de suscripción
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Plan</Label>
                  <Input id="name" placeholder="Plan Básico" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">FREE</SelectItem>
                      <SelectItem value="BASIC">BASIC</SelectItem>
                      <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción del plan..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (centavos)</Label>
                  <Input id="price" type="number" placeholder="14999" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxProducts">Máx. Productos</Label>
                  <Input id="maxProducts" type="number" placeholder="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxImages">Máx. Imágenes</Label>
                  <Input id="maxImages" type="number" placeholder="10" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Crear Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={!plan.isActive ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {plan.description}
                  </CardDescription>
                </div>
                <Badge variant={plan.isActive ? "outline" : "secondary"}>
                  {plan.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="font-bold text-3xl">
                    {plan.price === 0
                      ? "Gratis"
                      : `$${(plan.price / 100).toFixed(2)}`}
                  </div>
                  <div className="text-muted-foreground text-sm">por mes</div>
                </div>
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Planes</CardTitle>
          <CardDescription>{plans.length} planes configurados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={plans}
            columns={columns}
            searchPlaceholder="Buscar por nombre..."
          />
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Plan</DialogTitle>
            <DialogDescription>
              Modifica los parámetros del plan
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre del Plan</Label>
                  <Input
                    id="edit-name"
                    value={selectedPlan.name}
                    onChange={(e) =>
                      setSelectedPlan({ ...selectedPlan, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Tipo</Label>
                  <Select
                    value={selectedPlan.type}
                    onValueChange={(value) =>
                      setSelectedPlan({
                        ...selectedPlan,
                        type: value as PlanType,
                      })
                    }
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">FREE</SelectItem>
                      <SelectItem value="BASIC">BASIC</SelectItem>
                      <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={selectedPlan.description}
                  onChange={(e) =>
                    setSelectedPlan({
                      ...selectedPlan,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Precio (centavos)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedPlan.price}
                    onChange={(e) =>
                      setSelectedPlan({
                        ...selectedPlan,
                        price: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxProducts">Máx. Productos</Label>
                  <Input
                    id="edit-maxProducts"
                    type="number"
                    value={selectedPlan.maxProducts}
                    onChange={(e) =>
                      setSelectedPlan({
                        ...selectedPlan,
                        maxProducts: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxImages">Máx. Imágenes</Label>
                  <Input
                    id="edit-maxImages"
                    type="number"
                    value={selectedPlan.maxImages}
                    onChange={(e) =>
                      setSelectedPlan({
                        ...selectedPlan,
                        maxImages: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={toggleAlertOpen} onOpenChange={setToggleAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPlan?.isActive ? "¿Desactivar plan?" : "¿Activar plan?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPlan?.isActive
                ? `El plan "${selectedPlan?.name}" dejará de estar disponible para nuevas suscripciones.`
                : `El plan "${selectedPlan?.name}" estará disponible para nuevas suscripciones.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedPlan && handleToggleActive(selectedPlan.id)
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
