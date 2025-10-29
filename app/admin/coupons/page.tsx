"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
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
import { mockCouponRedemptions, mockCoupons } from "@/lib/data/mock-data";
import type { Coupon, PlanType } from "@/types/admin";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [redemptions] = useState(mockCouponRedemptions);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [toggleAlertOpen, setToggleAlertOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const handleToggleActive = (couponId: string) => {
    setCoupons(
      coupons.map((c) =>
        c.id === couponId ? { ...c, isActive: !c.isActive } : c,
      ),
    );
    setToggleAlertOpen(false);
    console.log("Toggle activo cupón:", couponId);
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedCoupon) {
      setCoupons(
        coupons.map((c) => (c.id === selectedCoupon.id ? selectedCoupon : c)),
      );
      console.log("Editar cupón:", selectedCoupon);
    }
    setIsEditDialogOpen(false);
  };

  const handleDelete = (couponId: string) => {
    setCoupons(coupons.filter((c) => c.id !== couponId));
    setDeleteDialogOpen(false);
    console.log("Eliminar cupón:", couponId);
  };

  const handleCreate = () => {
    console.log("Crear nuevo cupón");
    setIsCreateDialogOpen(false);
  };

  const couponColumns: ColumnDef<Coupon>[] = [
    {
      accessorKey: "code",
      header: "Código",
      cell: ({ row }) => (
        <span className="font-medium font-mono">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => <Badge variant="outline">{row.original.plan}</Badge>,
    },
    {
      accessorKey: "durationMonths",
      header: "Duración",
      cell: ({ row }) =>
        `${row.original.durationMonths} ${row.original.durationMonths === 1 ? "mes" : "meses"}`,
    },
    {
      id: "usage",
      header: "Uso",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.currentUses} / {row.original.maxUses}
          </div>
          <div className="text-muted-foreground text-xs">
            {((row.original.currentUses / row.original.maxUses) * 100).toFixed(
              0,
            )}
            % usado
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "outline" : "secondary"}>
          {row.original.isActive ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: "Expira",
      cell: ({ row }) =>
        row.original.expiresAt
          ? new Date(row.original.expiresAt).toLocaleDateString("es-AR")
          : "Sin expiración",
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedCoupon(row.original);
              setToggleAlertOpen(true);
            }}
          >
            <Power className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedCoupon(row.original);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const redemptionColumns: ColumnDef<(typeof redemptions)[0]>[] = [
    {
      accessorKey: "couponCode",
      header: "Código",
      cell: ({ row }) => (
        <span className="font-mono">{row.original.couponCode}</span>
      ),
    },
    {
      accessorKey: "businessName",
      header: "Negocio",
    },
    {
      accessorKey: "redeemedAt",
      header: "Fecha de Canje",
      cell: ({ row }) =>
        new Date(row.original.redeemedAt).toLocaleDateString("es-AR"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Gestión de Cupones
          </h1>
          <p className="text-muted-foreground">
            Crea y administra cupones de descuento
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Cupón
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Cupón</DialogTitle>
              <DialogDescription>
                Define los parámetros del cupón de descuento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input id="code" placeholder="SUMMER2024" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select>
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Seleccionar plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">FREE</SelectItem>
                    <SelectItem value="BASIC">BASIC</SelectItem>
                    <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (meses)</Label>
                <Input id="duration" type="number" placeholder="3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUses">Usos Máximos</Label>
                <Input id="maxUses" type="number" placeholder="100" />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Crear Cupón</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Cupones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{coupons.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Cupones Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {coupons.filter((c) => c.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Canjes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{redemptions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cupones</CardTitle>
          <CardDescription>
            {coupons.length} cupones registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={coupons}
            columns={couponColumns}
            searchPlaceholder="Buscar por código..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Canjes</CardTitle>
          <CardDescription>Cupones canjeados por negocios</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={redemptions}
            columns={redemptionColumns}
            searchPlaceholder="Buscar por negocio..."
          />
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cupón</DialogTitle>
            <DialogDescription>
              Modifica los parámetros del cupón
            </DialogDescription>
          </DialogHeader>
          {selectedCoupon && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Código</Label>
                <Input
                  id="edit-code"
                  value={selectedCoupon.code}
                  onChange={(e) =>
                    setSelectedCoupon({
                      ...selectedCoupon,
                      code: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Plan</Label>
                <Select
                  value={selectedCoupon.plan}
                  onValueChange={(value) =>
                    setSelectedCoupon({
                      ...selectedCoupon,
                      plan: value as PlanType,
                    })
                  }
                >
                  <SelectTrigger id="edit-plan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">FREE</SelectItem>
                    <SelectItem value="BASIC">BASIC</SelectItem>
                    <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duración (meses)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={selectedCoupon.durationMonths}
                  onChange={(e) =>
                    setSelectedCoupon({
                      ...selectedCoupon,
                      durationMonths: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxUses">Usos Máximos</Label>
                <Input
                  id="edit-maxUses"
                  type="number"
                  value={selectedCoupon.maxUses}
                  onChange={(e) =>
                    setSelectedCoupon({
                      ...selectedCoupon,
                      maxUses: Number.parseInt(e.target.value),
                    })
                  }
                />
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
              {selectedCoupon?.isActive
                ? "¿Desactivar cupón?"
                : "¿Activar cupón?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCoupon?.isActive
                ? `El cupón "${selectedCoupon?.code}" dejará de estar disponible para su uso.`
                : `El cupón "${selectedCoupon?.code}" estará disponible para su uso.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedCoupon && handleToggleActive(selectedCoupon.id)
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cupón?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar el cupón "{selectedCoupon?.code}". Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedCoupon && handleDelete(selectedCoupon.id)}
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
