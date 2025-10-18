// Type definitions for the platform

import type { icons } from "lucide-react";

export type PlanType = "FREE" | "BASIC" | "PREMIUM";
export type PlanStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  address?: string;
  logo?: string;
  plan: PlanType;
  planStatus: PlanStatus;
  planExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  price?: number;
  images: string[];
  category: string;
  active: boolean;
  featured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  business?: Business;
}

export interface Payment {
  id: string;
  businessId: string;
  amount: number;
  plan: PlanType;
  status: PaymentStatus;
  mercadoPagoId?: string;
  mercadoPagoStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  businessId?: string;
  productId?: string;
  type: "product_view" | "business_view" | "contact_click";
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface PlanLimits {
  maxProducts: number;
  canFeatureProducts: boolean;
  hasAnalytics: boolean;
  hasAdvancedAnalytics: boolean;
  priorityInSearch: boolean;
}

export interface AnalyticsData {
  totalViews: number;
  totalProducts: number;
  totalActiveProducts: number;
  viewsChange: number;
  topProducts: Array<{
    id: string;
    name: string;
    views: number;
  }>;
  viewsByDay: Array<{
    date: string;
    views: number;
  }>;
  trafficSources: Array<{
    source: string;
    count: number;
  }>;
}

export type IconComponentName = keyof typeof icons;

// Enums para valores conocidos
export enum CollectionStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
}

export enum PaymentStatusMP {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
  IN_PROCESS = "in_process",
  IN_MEDIATION = "in_mediation",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  CHARGED_BACK = "charged_back",
}

export enum PaymentType {
  ACCOUNT_MONEY = "account_money",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  TICKET = "ticket",
  BANK_TRANSFER = "bank_transfer",
  ATM = "atm",
}

export enum SiteId {
  MLA = "MLA", // Argentina
  MLB = "MLB", // Brasil
  MLM = "MLM", // México
  MLC = "MLC", // Chile
  MLU = "MLU", // Uruguay
  MPE = "MPE", // Perú
  MCO = "MCO", // Colombia
}

export enum ProcessingMode {
  AGGREGATOR = "aggregator",
  GATEWAY = "gateway",
}

export interface MercadoPagoCallbackParams {
  collection_id: string;
  collection_status: CollectionStatus;
  payment_id: string;
  status: PaymentStatusMP;
  external_reference: string;
  payment_type: PaymentType;
  merchant_order_id: string;
  preference_id: string;
  site_id: SiteId;
  processing_mode: ProcessingMode;
  merchant_account_id: string | null;
}
