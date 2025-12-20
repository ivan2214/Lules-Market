/**
 * ===============================================================
 * DRIZZLE ORM TYPE DEFINITIONS
 * ===============================================================
 *
 * Este archivo contiene todas las definiciones de tipos inferidos
 * de Drizzle ORM para operaciones CRUD y consultas con relaciones.
 *
 * Clean Architecture:
 * - Types: Tipos inferidos automáticamente de los schemas
 * - DTOs: Tipos con relaciones para transferencia de datos
 * - Input Types: Tipos para mutaciones (create, update, delete)
 */

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  account,
  admin,
  analytics,
  bannedBusiness,
  bannedImages,
  bannedProduct,
  business,
  businessView,
  category,
  currentPlan,
  emailVerificationToken,
  image,
  log,
  notification,
  passwordResetToken,
  payment,
  plan,
  product,
  productView,
  profile,
  session,
  trial,
  // Schemas
  user,
  verification,
  webhookEvent,
} from "../schema";

// ===============================================================
// BASE SELECT TYPES (Tipos inferidos para SELECT)
// ===============================================================

/** Usuario base sin relaciones */
export type User = InferSelectModel<typeof user>;

/** Sesión base */
export type Session = InferSelectModel<typeof session>;

/** Cuenta OAuth */
export type Account = InferSelectModel<typeof account>;

/** Token de verificación */
export type Verification = InferSelectModel<typeof verification>;

/** Negocio base */
export type Business = InferSelectModel<typeof business>;

/** Plan actual del negocio */
export type CurrentPlan = InferSelectModel<typeof currentPlan>;

/** Plan disponible */
export type Plan = InferSelectModel<typeof plan>;

/** Trial de negocio */
export type Trial = InferSelectModel<typeof trial>;

/** Vista de negocio (analytics) */
export type BusinessView = InferSelectModel<typeof businessView>;

/** Producto base */
export type Product = InferSelectModel<typeof product>;

/** Vista de producto (analytics) */
export type ProductView = InferSelectModel<typeof productView>;

/** Categoría */
export type Category = InferSelectModel<typeof category>;

/** Imagen */
export type Image = InferSelectModel<typeof image>;

/** Notificación */
export type Notification = InferSelectModel<typeof notification>;

/** Pago */
export type Payment = InferSelectModel<typeof payment>;

/** Analytics */
export type Analytics = InferSelectModel<typeof analytics>;

/** Evento de webhook */
export type WebhookEvent = InferSelectModel<typeof webhookEvent>;

/** Log de sistema */
export type Log = InferSelectModel<typeof log>;

/** Perfil de usuario */
export type Profile = InferSelectModel<typeof profile>;

/** Admin */
export type Admin = InferSelectModel<typeof admin>;

/** Token de verificación de email */
export type EmailVerificationToken = InferSelectModel<
  typeof emailVerificationToken
>;

/** Token de reset de password */
export type PasswordResetToken = InferSelectModel<typeof passwordResetToken>;

/** Negocio baneado */
export type BannedBusiness = InferSelectModel<typeof bannedBusiness>;

/** Producto baneado */
export type BannedProduct = InferSelectModel<typeof bannedProduct>;

/** Imagen baneada */
export type BannedImages = InferSelectModel<typeof bannedImages>;

// ===============================================================
// INSERT TYPES (Tipos para CREATE)
// ===============================================================

/** Datos para crear usuario */
export type UserInsert = InferInsertModel<typeof user>;

/** Datos para crear sesión */
export type SessionInsert = InferInsertModel<typeof session>;

/** Datos para crear cuenta OAuth */
export type AccountInsert = InferInsertModel<typeof account>;

/** Datos para crear verificación */
export type VerificationInsert = InferInsertModel<typeof verification>;

/** Datos para crear negocio */
export type BusinessInsert = InferInsertModel<typeof business>;

/** Datos para crear plan actual */
export type CurrentPlanInsert = InferInsertModel<typeof currentPlan>;

/** Datos para crear plan */
export type PlanInsert = InferInsertModel<typeof plan>;

/** Datos para crear trial */
export type TrialInsert = InferInsertModel<typeof trial>;

/** Datos para crear vista de negocio */
export type BusinessViewInsert = InferInsertModel<typeof businessView>;

/** Datos para crear producto */
export type ProductInsert = InferInsertModel<typeof product>;

/** Datos para crear vista de producto */
export type ProductViewInsert = InferInsertModel<typeof productView>;

/** Datos para crear categoría */
export type CategoryInsert = InferInsertModel<typeof category>;

/** Datos para crear imagen */
export type ImageInsert = InferInsertModel<typeof image>;

/** Datos para crear notificación */
export type NotificationInsert = InferInsertModel<typeof notification>;

/** Datos para crear pago */
export type PaymentInsert = InferInsertModel<typeof payment>;

/** Datos para crear analytics */
export type AnalyticsInsert = InferInsertModel<typeof analytics>;

/** Datos para crear webhook event */
export type WebhookEventInsert = InferInsertModel<typeof webhookEvent>;

/** Datos para crear log */
export type LogInsert = InferInsertModel<typeof log>;

/** Datos para crear perfil */
export type ProfileInsert = InferInsertModel<typeof profile>;

/** Datos para crear admin */
export type AdminInsert = InferInsertModel<typeof admin>;

/** Datos para crear token de verificación de email */
export type EmailVerificationTokenInsert = InferInsertModel<
  typeof emailVerificationToken
>;

/** Datos para crear token de reset de password */
export type PasswordResetTokenInsert = InferInsertModel<
  typeof passwordResetToken
>;

/** Datos para crear negocio baneado */
export type BannedBusinessInsert = InferInsertModel<typeof bannedBusiness>;

/** Datos para crear producto baneado */
export type BannedProductInsert = InferInsertModel<typeof bannedProduct>;

/** Datos para crear imagen baneada */
export type BannedImagesInsert = InferInsertModel<typeof bannedImages>;

// ===============================================================
// UPDATE TYPES (Tipos para UPDATE - todos los campos opcionales)
// ===============================================================

/** Datos para actualizar usuario */
export type UserUpdate = Partial<Omit<UserInsert, "id">>;

/** Datos para actualizar sesión */
export type SessionUpdate = Partial<Omit<SessionInsert, "id">>;

/** Datos para actualizar cuenta OAuth */
export type AccountUpdate = Partial<Omit<AccountInsert, "id">>;

/** Datos para actualizar verificación */
export type VerificationUpdate = Partial<Omit<VerificationInsert, "id">>;

/** Datos para actualizar negocio */
export type BusinessUpdate = Partial<Omit<BusinessInsert, "id">>;

/** Datos para actualizar plan actual */
export type CurrentPlanUpdate = Partial<Omit<CurrentPlanInsert, "id">>;

/** Datos para actualizar plan */
export type PlanUpdate = Partial<Omit<PlanInsert, "type">>;

/** Datos para actualizar trial */
export type TrialUpdate = Partial<Omit<TrialInsert, "id">>;

/** Datos para actualizar producto */
export type ProductUpdate = Partial<Omit<ProductInsert, "id">>;

/** Datos para actualizar categoría */
export type CategoryUpdate = Partial<Omit<CategoryInsert, "id">>;

/** Datos para actualizar imagen */
export type ImageUpdate = Partial<Omit<ImageInsert, "key">>;

/** Datos para actualizar notificación */
export type NotificationUpdate = Partial<Omit<NotificationInsert, "id">>;

/** Datos para actualizar pago */
export type PaymentUpdate = Partial<Omit<PaymentInsert, "id">>;

/** Datos para actualizar perfil */
export type ProfileUpdate = Partial<Omit<ProfileInsert, "userId">>;

/** Datos para actualizar admin */
export type AdminUpdate = Partial<Omit<AdminInsert, "userId">>;

// ===============================================================
// TIPOS CON RELACIONES (DTOs)
// ===============================================================

/**
 * Usuario con todas sus relaciones
 */
export interface UserWithRelations extends User {
  sessions?: Session[];
  accounts?: Account[];
  business?: BusinessWithRelations | null;
  admin?: AdminWithRelations | null;
  profile?: ProfileWithRelations | null;
  emailVerificationTokens?: EmailVerificationToken[];
  passwordResetTokens?: PasswordResetToken[];
  notifications?: Notification[];
}

/**
 * Negocio con todas sus relaciones
 */
export interface BusinessWithRelations extends Business {
  user?: User | null;
  currentPlan?: CurrentPlanWithRelations | null;
  logo?: Image | null;
  coverImage?: Image | null;
  products?: ProductWithRelations[];
  payments?: Payment[];
  bannedBusiness?: BannedBusiness | null;
  businessViews?: BusinessView[];
  trial?: Trial | null;
  category?: Category | null;
}

/**
 * Plan actual con relaciones
 */
export interface CurrentPlanWithRelations extends CurrentPlan {
  business?: Business | null;
  plan?: Plan | null;
}

/**
 * Producto con todas sus relaciones
 */
export interface ProductWithRelations extends Product {
  business?: BusinessWithRelations | null;
  bannedProduct?: BannedProduct | null;
  images?: Image[];
  productViews?: ProductView[];
  category?: Category | null;
}

/**
 * Categoría con relaciones
 */
export interface CategoryWithRelations extends Category {
  products?: Product[];
  businesses?: Business[];
}

/**
 * Imagen con relaciones
 */
export interface ImageWithRelations extends Image {
  product?: Product | null;
  logoBusiness?: Business | null;
  coverBusiness?: Business | null;
  avatar?: Profile | null;
  bannedImages?: BannedImages | null;
}

/**
 * Perfil con relaciones
 */
export interface ProfileWithRelations extends Profile {
  user?: User | null;
  avatar?: Image | null;
}

/**
 * Admin con relaciones
 */
export interface AdminWithRelations extends Admin {
  user?: User | null;
  bannedBusinesses?: BannedBusiness[];
  bannedProducts?: BannedProduct[];
  bannedImages?: BannedImages[];
}

/**
 * Trial con relaciones
 */
export interface TrialWithRelations extends Trial {
  business?: Business | null;
}

/**
 * Pago con relaciones
 */
export interface PaymentWithRelations extends Payment {
  business?: BusinessWithRelations | null;
}

/**
 * Notificación con relaciones
 */
export interface NotificationWithRelations extends Notification {
  user?: User | null;
}

// ===============================================================
// ENUMS (Re-exportar para conveniencia)
// ===============================================================

export type PlanType = "FREE" | "BASIC" | "PREMIUM";
export type PlanStatus = "ACTIVE" | "INACTIVE" | "CANCELLED" | "EXPIRED";
export type UserRole = "ADMIN" | "USER" | "BUSINESS" | "SUPER_ADMIN";
export type Permission =
  | "ALL"
  | "BAN_USERS"
  | "MANAGE_PLANS"
  | "MANAGE_PAYMENTS"
  | "MODERATE_CONTENT"
  | "VIEW_ANALYTICS";
export type BusinessStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "SUSPENDED"
  | "INACTIVE";
export type NotificationType =
  | "PRODUCT_AVAILABLE"
  | "PLAN_EXPIRING"
  | "PLAN_EXPIRED"
  | "PAYMENT_RECEIVED"
  | "ACCOUNT_VERIFIED"
  | "REPORT_RESOLVED";

// ===============================================================
// UTILITY TYPES
// ===============================================================

/**
 * Resultado de una operación de mutación
 */
export interface MutationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Opciones de paginación
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * Opciones de ordenamiento
 */
export interface SortOptions<T = string> {
  field: T;
  direction: "asc" | "desc";
}

/**
 * Opciones de filtrado
 */
export interface FilterOptions<T = Record<string, unknown>> {
  where?: Partial<T>;
  search?: string;
  searchFields?: string[];
}

/**
 * Opciones de query combinadas
 */
export interface QueryOptions<T = Record<string, unknown>>
  extends PaginationOptions,
    FilterOptions<T> {
  sort?: SortOptions;
  includeRelations?: boolean;
}
