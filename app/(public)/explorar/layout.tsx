import type { ReactNode } from "react";
import {
  getCategories,
  getPublicBusinesses,
} from "@/app/actions/public-actions";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FiltersSidebar } from "./components/filters-sidebar";

interface ExplorarLayoutFormProps {
  children: ReactNode;
}

const ExplorarLayout: React.FC<ExplorarLayoutFormProps> = async ({
  children,
}) => {
  const categories = await getCategories();
  const { businesses } = await getPublicBusinesses();

  return (
    <SidebarProvider>
      <FiltersSidebar categories={categories} businesses={businesses} />
      <SidebarInset>
        <SidebarTrigger className="m-5 lg:m-0" />
        <main className="mx-auto w-full flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ExplorarLayout;
