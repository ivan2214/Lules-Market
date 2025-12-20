"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
  baseUrl?: string;
}

export function PaginationControls({
  totalPages,
  currentPage,
  baseUrl,
}: PaginationControlsProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${baseUrl || "?"}${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        className="hidden size-8 p-0 lg:flex"
        disabled={currentPage <= 1}
        asChild
      >
        <Link
          href={currentPage <= 1 ? "#" : createPageUrl(1)}
          aria-disabled={currentPage <= 1}
          tabIndex={currentPage <= 1 ? -1 : undefined}
          className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
        >
          <span className="sr-only">Ir a la primera página</span>
          <ChevronsLeft className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="outline"
        className="size-8 p-0"
        disabled={currentPage <= 1}
        asChild
      >
        <Link
          href={currentPage <= 1 ? "#" : createPageUrl(currentPage - 1)}
          aria-disabled={currentPage <= 1}
          tabIndex={currentPage <= 1 ? -1 : undefined}
          className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
        >
          <span className="sr-only">Ir a la página anterior</span>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div className="flex w-[100px] items-center justify-center font-medium text-sm">
        Página {currentPage} de {totalPages}
      </div>
      <Button
        variant="outline"
        className="size-8 p-0"
        disabled={currentPage >= totalPages}
        asChild
      >
        <Link
          href={
            currentPage >= totalPages ? "#" : createPageUrl(currentPage + 1)
          }
          aria-disabled={currentPage >= totalPages}
          tabIndex={currentPage >= totalPages ? -1 : undefined}
          className={cn(
            currentPage >= totalPages && "pointer-events-none opacity-50",
          )}
        >
          <span className="sr-only">Ir a la página siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="outline"
        className="hidden size-8 p-0 lg:flex"
        disabled={currentPage >= totalPages}
        asChild
      >
        <Link
          href={currentPage >= totalPages ? "#" : createPageUrl(totalPages)}
          aria-disabled={currentPage >= totalPages}
          tabIndex={currentPage >= totalPages ? -1 : undefined}
          className={cn(
            currentPage >= totalPages && "pointer-events-none opacity-50",
          )}
        >
          <span className="sr-only">Ir a la última página</span>
          <ChevronsRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
