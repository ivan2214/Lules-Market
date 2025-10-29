// Core entity types with strong typing

import type { UserDTO } from "@/app/data/user/user.dto";
import type {
  Admin as AdminPrisma,
  SubscriptionPlan,
  SubscriptionStatus,
  Trial as TrialPrisma,
} from "@/app/generated/prisma";

export type UserRole = "USER" | "BUSINESS" | "ADMIN";
export type PlanType = "FREE" | "BASIC" | "PREMIUM";
export type PaymentStatus = "approved" | "pending" | "rejected";

export interface Business {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  ownerName: string;
  plan: SubscriptionPlan;
  isActive: boolean;
  isBanned: boolean;
  createdAt: Date;
  productsCount: number;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  businessId: string;
  businessName: string;
  category: string;
  isActive: boolean;
  isBanned: boolean;
  createdAt: Date;
  imageUrl?: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: SubscriptionStatus;
  businessId: string;
  businessName: string;
  plan: SubscriptionPlan;
  method: string;
  createdAt: Date;
  externalId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  plan: SubscriptionPlan;
  durationMonths: number;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface CouponRedemption {
  id: string;
  couponId: string;
  couponCode: string;
  businessId: string;
  businessName: string;
  redeemedAt: Date;
}

export interface Trial extends TrialPrisma {
  businessName: string;
  plan: SubscriptionPlan;
  isActive: boolean;
}

export interface Admin extends AdminPrisma {
  user: UserDTO;
}

export interface Plan {
  id: string;
  type: SubscriptionPlan;
  name: string;
  description: string;
  price: number;
  features: string[];
  maxProducts: number;
  maxImages: number;
  isActive: boolean;
  createdAt: Date;
}

export interface WebhookEvent {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  status: string;
  createdAt: Date;
}

export interface Analytics {
  totalUsers: number;
  totalBusinesses: number;
  totalProducts: number;
  totalPayments: number;
  totalRevenue: number;
  activeTrials: number;
  activeCoupons: number;
  bannedUsers: number;
  bannedBusinesses: number;
  bannedProducts: number;
  planDistribution: {
    FREE: number;
    BASIC: number;
    PREMIUM: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  businessGrowth: Array<{ month: string; count: number }>;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    banned: number;
    businessOwners: number;
  };
  businesses: {
    total: number;
    active: number;
    inactive: number;
    banned: number;
  };
  products: {
    total: number;
    active: number;
    banned: number;
  };
  payments: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    totalRevenue: number;
  };
  plans: {
    FREE: number;
    BASIC: number;
    PREMIUM: number;
  };
}
