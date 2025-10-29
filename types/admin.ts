// Core entity types with strong typing

export type UserRole = "USER" | "BUSINESS" | "ADMIN";
export type PlanType = "FREE" | "BASIC" | "PREMIUM";
export type PaymentStatus = "approved" | "pending" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  isBanned: boolean;
  isBusinessOwner: boolean;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  ownerName: string;
  plan: PlanType;
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
  status: PaymentStatus;
  businessId: string;
  businessName: string;
  plan: PlanType;
  method: string;
  createdAt: Date;
  externalId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  plan: PlanType;
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

export interface Trial {
  id: string;
  businessId: string;
  businessName: string;
  plan: PlanType;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface BannedUser {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  reason: string;
  bannedBy: string;
  bannedAt: Date;
}

export interface BannedBusiness {
  id: string;
  businessId: string;
  businessName: string;
  reason: string;
  bannedBy: string;
  bannedAt: Date;
}

export interface BannedProduct {
  id: string;
  productId: string;
  productName: string;
  businessName: string;
  reason: string;
  bannedBy: string;
  bannedAt: Date;
}

export interface Image {
  id: string;
  url: string;
  productId?: string;
  businessId?: string;
  uploadedAt: Date;
  isReported: boolean;
}

export interface Admin {
  id: string;
  userId: string;
  name: string;
  email: string;
  permissions: string[];
  createdAt: Date;
}

export interface Plan {
  id: string;
  type: PlanType;
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
