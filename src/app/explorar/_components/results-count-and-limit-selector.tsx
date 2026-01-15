import type { BusinessDto, ProductDto } from "@/shared/utils/dto";
import { LimitSelector } from "./limit-selector";

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
  businessesData?: {
    businesses: BusinessDto[];
    total: number;
    pages?: number;
    currentPage?: number;
  };
  productsData?: {
    products: ProductDto[];
    total: number;
    pages?: number;
    currentPage?: number;
  };
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
