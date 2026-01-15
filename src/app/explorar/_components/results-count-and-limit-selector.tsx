import { LimitSelector } from "@/features/explorar/_components/limit-selector";
import type { BusinessModel } from "@/server/modules/business/model";
import type { ProductModel } from "@/server/modules/products/model";

type SortByProduct = "price_asc" | "price_desc" | "name_asc" | "name_desc";
type SortByBusiness = "newest" | "oldest";

type Params = {
  search?: string;
  sortBy?: SortByProduct | SortByBusiness;
  category?: string;
  page?: string;
  limit?: string;
  businessId?: string;
};

interface ResultsCountAndLimitSelectorProps {
  typeExplorer: "comercios" | "productos";
  currentLimit: number;
  currentPage: number;
  params: Params;
  businessesData?: BusinessModel.ListAllOutput;
  productsData?: ProductModel.ListAllOutput;
}

export const ResultsCountAndLimitSelector: React.FC<
  ResultsCountAndLimitSelectorProps
> = ({ typeExplorer, currentLimit, businessesData, productsData }) => {
  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;

  const businesses = businessesData?.businesses || [];
  const totalBusinesses = businessesData?.total || 0;

  if (typeExplorer === "comercios") {
    return (
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Mostrando {businesses.length} de {totalBusinesses} comercios
        </p>
        <LimitSelector currentLimit={currentLimit} total={totalBusinesses} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        Mostrando {products.length} de {totalProducts} productos
      </p>
      <LimitSelector currentLimit={currentLimit} total={totalProducts} />
    </div>
  );
};
