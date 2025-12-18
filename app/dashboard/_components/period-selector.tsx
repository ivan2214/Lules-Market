"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select";

interface PeriodSelectorProps {
  currentPeriod: string;
}

export function PeriodSelector({ currentPeriod }: PeriodSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);
    router.push(`?${params.toString()}`);
  }

  return (
    <Select value={currentPeriod} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">Últimos 7 días</SelectItem>
        <SelectItem value="30d">Últimos 30 días</SelectItem>
        <SelectItem value="90d">Últimos 90 días</SelectItem>
      </SelectContent>
    </Select>
  );
}
