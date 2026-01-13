"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface LimitSelectorProps {
  currentLimit: number;
  total: number;
}

export function LimitSelector({ currentLimit, total }: LimitSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value);
    params.set("page", "1"); // Reset to first page when limit changes
    router.push(`${pathname}?${params.toString()}` as Route);
  };

  // Generar opciones automáticamente dividiendo el total
  const options: number[] = [];
  for (let i = 1; i <= total; i++) {
    if (total % i === 0) {
      options.push(total / i);
    }
  }

  // Asegurarse de que el currentLimit siempre esté en las opciones
  if (!options.includes(currentLimit)) {
    options.unshift(currentLimit);
  }

  // Orden descendente para UX más común (opcional)
  options.sort((a, b) => b - a);

  return (
    <div className="flex items-center space-x-2">
      <p className="font-medium text-sm">Mostrar</p>
      <Select value={currentLimit.toString()} onValueChange={handleLimitChange}>
        <SelectTrigger className="h-8 w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent side="top">
          {options.map((limit) => (
            <SelectItem key={limit} value={limit.toString()}>
              {limit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
