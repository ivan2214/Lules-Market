"use client";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type * as React from "react";
import type { Business } from "@/app/generated/prisma";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createSearchUrl } from "@/lib/utils";
import { SearchFormSidebar } from "./search-form-sidebar";

interface FiltersSidebarProps extends React.ComponentProps<typeof Sidebar> {
  categories: string[];
  businesses: Business[];
  currentParams?: {
    search?: string;
    category?: string;
    page?: string;
    businessId?: string;
    sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
  };
}

export function FiltersSidebar({
  categories,
  businesses,

  ...props
}: FiltersSidebarProps) {
  const params = useSearchParams();
  const currentParams = {
    search: params.get("search") ?? undefined,
    category: params.get("category") ?? undefined,
    page: params.get("page") ?? undefined,
    businessId: params.get("businessId") ?? undefined,
    sort: params.get("sort") as
      | "price_asc"
      | "price_desc"
      | "name_asc"
      | "name_desc"
      | undefined,
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader className="mt-16">
        <SearchFormSidebar />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible
              defaultOpen={currentParams?.category !== undefined || true}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    Categorías
                    <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {categories.map((item) => (
                      <SidebarMenuSubItem key={item}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            item === currentParams?.category &&
                            currentParams?.category !== undefined
                          }
                          size="sm"
                        >
                          <Link
                            href={createSearchUrl(currentParams ?? {}, {
                              category: item,
                            })}
                          >
                            {item}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
          <SidebarMenu>
            <Collapsible
              defaultOpen={currentParams?.businessId !== undefined}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    Negocios
                    <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className="">
                  <SidebarMenuSub>
                    {businesses.map((item) => (
                      <SidebarMenuSubItem key={item.id}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={item.id === currentParams?.businessId}
                          size="sm"
                        >
                          <Link
                            href={createSearchUrl(currentParams ?? {}, {
                              businessId: item.id,
                            })}
                          >
                            {item.name}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
