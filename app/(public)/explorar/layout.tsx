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
        <SidebarTrigger className="" />
        <div className="flex flex-1 flex-col gap-4 p-5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ExplorarLayout;
