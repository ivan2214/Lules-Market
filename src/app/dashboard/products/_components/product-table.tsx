import { useId } from "react";
import { formatCurrency } from "@/lib/format";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { CategoryDto, ProductDto } from "@/shared/utils/dto";
import { mainImage } from "@/shared/utils/main-image";
import { ProductActions } from "./product-actions";

interface ProductTableProps {
  items: ProductDto[];
  categories: CategoryDto[];
  maxImagesPerProduct: number;
}

export const ProductTable = ({
  items,
  categories,
  maxImagesPerProduct,
}: ProductTableProps) => {
  const id = useId();

  return (
    <div className="w-full">
      <div className="[&>div]:rounded-sm [&>div]:border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <Checkbox id={id} aria-label="select-all" />
              </TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="w-0">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="has-data-[state=checked]:bg-muted/50"
              >
                <TableCell>
                  <Checkbox
                    id={`table-checkbox-${item.id}`}
                    aria-label={`product-checkbox-${item.id}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="rounded-sm">
                      <AvatarImage
                        src={mainImage({
                          images: item.images,
                        })}
                        alt={item.name}
                      />
                      <AvatarFallback className="text-xs">
                        {item.name}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <span className="mt-0.5 text-muted-foreground text-xs">
                        {item.brand || "Sin marca"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>{item.category?.value}</TableCell>
                <TableCell>{formatCurrency(item.price, "ARS")}</TableCell>
                <ProductActions
                  item={item}
                  maxImagesPerProduct={maxImagesPerProduct}
                  categories={categories}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="mt-4 text-center text-muted-foreground text-sm">
        Product Table
      </p>
    </div>
  );
};
