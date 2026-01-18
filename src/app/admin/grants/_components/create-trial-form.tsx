"use client";

import { addDays, addMonths, format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useTrialMutations } from "../../_hooks/use-admin-mutations";

interface Business {
  id: string;
  name: string;
}

interface CreateTrialFormProps {
  businesses: Business[];
}

export function CreateTrialForm({ businesses }: CreateTrialFormProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<"BASIC" | "PREMIUM">(
    "BASIC",
  );
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 30));
  const { createTrial } = useTrialMutations();

  const handleSubmit = async () => {
    if (!selectedBusiness) {
      toast.error("Selecciona un comercio");
      return;
    }

    try {
      await createTrial.mutateAsync({
        businessId: selectedBusiness,
        planType: selectedPlan,
        endDate,
      });
      toast.success("Trial creado", {
        description: "El período de prueba ha sido asignado exitosamente.",
      });
      setSelectedBusiness("");
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "No se pudo crear el trial",
      });
    }
  };

  const presetDurations = [
    { label: "7 días", days: 7 },
    { label: "14 días", days: 14 },
    { label: "30 días", days: 30 },
    { label: "3 meses", months: 3 },
    { label: "6 meses", months: 6 },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="font-medium text-sm">Comercio</Label>
        <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un comercio" />
          </SelectTrigger>
          <SelectContent>
            {businesses.map((business) => (
              <SelectItem key={business.id} value={business.id}>
                {business.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-sm">Plan</Label>
        <Select
          value={selectedPlan}
          onValueChange={(v) => setSelectedPlan(v as "BASIC" | "PREMIUM")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BASIC">Básico</SelectItem>
            <SelectItem value="PREMIUM">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-sm">Duración</Label>
        <div className="flex flex-wrap gap-2">
          {presetDurations.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() =>
                setEndDate(
                  preset.months
                    ? addMonths(new Date(), preset.months)
                    : addDays(new Date(), preset.days || 0),
                )
              }
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-sm">Fecha de expiración</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate
                ? format(endDate, "PPP", { locale: es })
                : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => date && setEndDate(date)}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!selectedBusiness || createTrial.isPending}
        className="w-full"
      >
        {createTrial.isPending ? "Creando..." : "Crear Trial"}
      </Button>
    </div>
  );
}
