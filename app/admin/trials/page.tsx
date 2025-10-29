"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Plus, XCircle } from "lucide-react";
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
import { mockTrials } from "@/lib/data/mock-data";
import type { Trial } from "@/types/admin";

export default function TrialsPage() {
  const [trials, setTrials] = useState(mockTrials);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null);
  const [extendDate, setExtendDate] = useState("");

  const handleEndTrial = (trialId: string) => {
    setTrials(
      trials.map((t) => (t.id === trialId ? { ...t, isActive: false } : t)),
    );
    setEndDialogOpen(false);
    console.log("Finalizar trial:", trialId);
  };

  const handleExtend = (trial: Trial) => {
    setSelectedTrial(trial);
    const currentEndDate = new Date(trial.endDate);
    const nextWeek = new Date(currentEndDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setExtendDate(nextWeek.toISOString().split("T")[0]);
    setExtendDialogOpen(true);
  };

  const handleConfirmExtend = () => {
    if (selectedTrial && extendDate) {
      setTrials(
        trials.map((t) =>
          t.id === selectedTrial.id
            ? { ...t, endDate: new Date(extendDate) }
            : t,
        ),
      );
      console.log("Extender trial:", selectedTrial.id, "hasta:", extendDate);
      setExtendDialogOpen(false);
    }
  };

  const handleCreate = () => {
    console.log("Crear nuevo trial");
    setIsCreateDialogOpen(false);
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  const columns: ColumnDef<Trial>[] = [
    {
      accessorKey: "businessName",
      header: "Negocio",
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => <Badge variant="outline">{row.original.plan}</Badge>,
    },
    {
      accessorKey: "startDate",
      header: "Fecha de Inicio",
      cell: ({ row }) =>
        new Date(row.original.startDate).toLocaleDateString("es-AR"),
    },
    {
      accessorKey: "endDate",
      header: "Fecha de Fin",
      cell: ({ row }) => {
        const daysRemaining = getDaysRemaining(row.original.endDate);
        return (
          <div>
            <div>
              {new Date(row.original.endDate).toLocaleDateString("es-AR")}
            </div>
            {row.original.isActive && (
              <div
                className={`text-xs ${daysRemaining < 3 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {daysRemaining > 0
                  ? `${daysRemaining} días restantes`
                  : "Expirado"}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "outline" : "secondary"}>
          {row.original.isActive ? "Activo" : "Finalizado"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isActive && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExtend(row.original)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Extender
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedTrial(row.original);
                  setEndDialogOpen(true);
                }}
              >
                <XCircle className="mr-2 h-4 w-4 text-destructive" />
                Finalizar
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const activeTrials = trials.filter((t) => t.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Pruebas Gratuitas
          </h1>
          <p className="text-muted-foreground">
            Gestiona las pruebas gratuitas de los negocios
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Trial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Prueba Gratuita</DialogTitle>
              <DialogDescription>
                Asigna una prueba gratuita a un negocio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="business">Negocio</Label>
                <Input id="business" placeholder="Buscar negocio..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select>
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Seleccionar plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BASIC">BASIC</SelectItem>
                    <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (días)</Label>
                <Input id="duration" type="number" placeholder="14" />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Crear Trial</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Trials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{trials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Trials Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {activeTrials.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Por Expirar (3 días)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-yellow-600">
              {
                activeTrials.filter(
                  (t) =>
                    getDaysRemaining(t.endDate) <= 3 &&
                    getDaysRemaining(t.endDate) > 0,
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pruebas Gratuitas</CardTitle>
          <CardDescription>{trials.length} trials registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={trials}
            columns={columns}
            searchPlaceholder="Buscar por negocio..."
          />
        </CardContent>
      </Card>

      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extender Prueba Gratuita</DialogTitle>
            <DialogDescription>
              Selecciona la nueva fecha de finalización para "
              {selectedTrial?.businessName}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="extend-date">Nueva Fecha de Finalización</Label>
              <Input
                id="extend-date"
                type="date"
                value={extendDate}
                onChange={(e) => setExtendDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            {selectedTrial && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <div className="font-medium">Fecha actual de finalización:</div>
                <div className="text-muted-foreground">
                  {new Date(selectedTrial.endDate).toLocaleDateString("es-AR")}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExtendDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmExtend}>Extender Trial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Finalizar prueba gratuita?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de finalizar la prueba gratuita de "
              {selectedTrial?.businessName}". El negocio perderá acceso a las
              funciones del plan {selectedTrial?.plan}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedTrial && handleEndTrial(selectedTrial.id)}
              className="bg-destructive text-destructive-foreground"
            >
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
