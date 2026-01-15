import type {
  BusinessWithRelations,
  Category,
  ProductWithRelations,
} from "@/db/types";

/**
 * Data Transfer Objects (DTOs) for normalizing data sent to the client.
 * Following Next.js DAL/DTO recommendations: https://nextjs.org/docs/app/guides/data-security#data-access-layer
 */

export interface ProductDto {
  id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
  businessId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  brand: string | null;
  discount: number; // ProductCard uses this for calculations, default to 0
  stock: number | null;
  tags: string[] | null;
  images: {
    key: string;
    url: string;
    isMainImage: boolean;
  }[];
  business?: {
    id: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    verified: boolean;
    whatsapp: string | null;
    phone: string | null;
    address: string | null;
    currentPlan?: {
      plan?: {
        type: string;
      } | null;
    } | null;
  };
  category?: {
    id: string;
    label: string;
    value: string;
  } | null;
}

export interface BusinessDto {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  category: string | null;
  userId: string;
  address: string | null;
  verified: boolean;
  whatsapp: string | null;
  phone: string | null;
}

export interface CategoryDto {
  id: string;
  label: string;
  value: string;
}

function ensureDate(date: string | Date | null): Date {
  if (!date) return new Date();
  return typeof date === "string" ? new Date(date) : date;
}

function ensureDateOrNull(date: string | Date | null): Date | null {
  if (!date) return null;
  return typeof date === "string" ? new Date(date) : date;
}

export function toProductDto(product: ProductWithRelations): ProductDto {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    active: product.active ?? true,
    businessId: product.businessId,
    categoryId: product.categoryId,
    createdAt: ensureDate(product.createdAt),
    updatedAt: ensureDateOrNull(product.updatedAt),
    brand: product.brand ?? null,
    discount: product.discount ?? 0,
    stock: product.stock ?? null,
    tags: product.tags ?? null,
    images: (product.images || []).map((img) => ({
      key: img.key,
      url: img.url,
      isMainImage: img.isMainImage,
    })),
    business: product.business
      ? {
          id: product.business.id,
          name: product.business.name,
          description: product.business.description,
          logoUrl: product.business.logo?.url ?? null,

          verified: product.business.verified ?? false,
          whatsapp: product.business.whatsapp ?? null,
          phone: product.business.phone ?? null,
          address: product.business.address ?? null,
          currentPlan: product.business.currentPlan
            ? {
                plan: product.business.currentPlan.plan
                  ? {
                      type: product.business.currentPlan.plan.type,
                    }
                  : null,
              }
            : null,
        }
      : undefined,
    category: product.category
      ? {
          id: product.category.id,
          label: product.category.label,
          value: product.category.value,
        }
      : null,
  };
}

export function toBusinessDto(business: BusinessWithRelations): BusinessDto {
  return {
    id: business.id,
    name: business.name,
    description: business.description,
    logoUrl: business.logo?.url ?? null,
    isActive: business.isActive ?? false,
    category: business.category?.label ?? null,
    userId: business.userId,
    address: business.address ?? null,
    verified: business.verified ?? false,
    whatsapp: business.whatsapp ?? null,
    phone: business.phone ?? null,
  };
}

export function toCategoryDto(category: Category): CategoryDto {
  return {
    id: category.id,
    label: category.label,
    value: category.value,
  };
}
