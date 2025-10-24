"use client";

import { ArrowDownAZ, ArrowUpAZ, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSearchUrl } from "@/lib/utils";

type OrderProps = {
  params: {
    sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
  };
};

export const Order: React.FC<OrderProps> = ({ params }) => {
  return (
    <div className="mt-4 sm:mt-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {params.sort === "price_asc" ? (
              "Precio: Menor a Mayor"
            ) : params.sort === "price_desc" ? (
              "Precio: Mayor a Menor"
            ) : params.sort === "name_asc" ? (
              <>
                <ArrowDownAZ className="h-4 w-4" /> Nombre: A-Z
              </>
            ) : params.sort === "name_desc" ? (
              <>
                <ArrowUpAZ className="h-4 w-4" /> Nombre: Z-A
              </>
            ) : (
              "Ordenar por"
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={createSearchUrl(params, { sort: "name_asc" })}>
              <ArrowDownAZ className="mr-2 h-4 w-4" /> Nombre: A-Z
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={createSearchUrl(params, { sort: "name_desc" })}>
              <ArrowUpAZ className="mr-2 h-4 w-4" /> Nombre: Z-A
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={createSearchUrl(params, { sort: "price_asc" })}>
              Precio: Menor a Mayor
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={createSearchUrl(params, { sort: "price_desc" })}>
              Precio: Mayor a Menor
            </Link>
          </DropdownMenuItem>
          {params.sort && (
            <DropdownMenuItem asChild>
              <Link href={createSearchUrl(params, { sort: undefined })}>
                Quitar ordenamiento
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
