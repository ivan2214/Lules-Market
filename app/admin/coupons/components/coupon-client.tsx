"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Power, Trash2 } from "lucide-react";
import { useState } from "react";
import type {
  CouponDTO,
  CouponRedemptionDTO,
} from "@/app/data/coupon/coupon.dto";
import type { PlanType } from "@/app/generated/prisma";
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

type CouponClientProps = {
  coupons: CouponDTO[];
  redemptions: CouponRedemptionDTO[];
};

export const CouponClient: React.FC<CouponClientProps> = ({
  coupons,
  redemptions,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [toggleAlertOpen, setToggleAlertOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponDTO | null>(null);

  const handleToggleActive = (_couponId: string) => {};

  const handleEdit = (coupon: CouponDTO) => {
    setSelectedCoupon(coupon);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedCoupon) {
    }
    setIsEditDialogOpen(false);
  };

  const handleDelete = (_couponId: string) => {
    setDeleteDialogOpen(false);
  };

  const couponColumns: ColumnDef<CouponDTO>[] = [
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
        `${row.original.durationDays} ${row.original.durationDays === 1 ? "día" : "días"}`,
    },
    {
      id: "usage",
      header: "Uso",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.usedCount} / {row.original.maxUses}
          </div>
          <div className="text-muted-foreground text-xs">
            {(
              ((row.original.usedCount ?? 0) / (row.original.maxUses ?? 1)) *
              100
            ).toFixed(0)}
            % usado
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.active ? "outline" : "secondary"}>
          {row.original.active ? "Activo" : "Inactivo"}
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

  const redemptionColumns: ColumnDef<CouponRedemptionDTO>[] = [
    {
      accessorKey: "coupon",
      header: "Código",
      cell: ({ row }) => (
        <span className="font-mono">{row.original.coupon.code}</span>
      ),
    },
    {
      accessorKey: "businessName",
      header: "Negocio",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.business.name}</span>
      ),
    },
    {
      accessorKey: "redeemedAt",
      header: "Fecha de Canje",
      cell: ({ row }) =>
        new Date(row.original.redeemedAt).toLocaleDateString("es-AR"),
    },
  ];
  return (
    <>
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
                  value={selectedCoupon.durationDays}
                  onChange={(e) =>
                    setSelectedCoupon({
                      ...selectedCoupon,
                      durationDays: Number.parseInt(e.target.value, 10),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxUses">Usos Máximos</Label>
                <Input
                  id="edit-maxUses"
                  type="number"
                  value={selectedCoupon.maxUses ?? ""}
                  onChange={(e) =>
                    setSelectedCoupon({
                      ...selectedCoupon,
                      maxUses: Number.parseInt(e.target.value, 10),
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
              {selectedCoupon?.active
                ? "¿Desactivar cupón?"
                : "¿Activar cupón?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCoupon?.active
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
    </>
  );
};
