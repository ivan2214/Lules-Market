"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LimitSelectorProps {
  currentLimit: number;
  total: number;
  currentPage: number;
}

export function LimitSelector({
  currentLimit,
  total,
  currentPage,
}: LimitSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value);
    params.set("page", "1"); // Reset to first page when limit changes
    router.push(`${pathname}?${params.toString()}`);
  };

  const options: number[] = [];

  for (let i = 1; i <= total; i++) {
    if (total % i === 0 && total / i !== currentPage) {
      options.push(total / i);
    }
  }

  console.log(options);

  return (
    <div className="flex items-center space-x-2">
      <p className="font-medium text-sm">Mostrar</p>
      <Select value={currentLimit.toString()} onValueChange={handleLimitChange}>
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={currentLimit} />
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
