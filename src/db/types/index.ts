import type { Static, TObject } from "@sinclair/typebox";
import type { models } from "../model";

// ============================================
// SELECT TYPES (DTOs)
// ============================================

export type Product = Static<TObject<typeof models.select.product>>;
export type Category = Static<TObject<typeof models.select.category>>;
export type Image = Static<TObject<typeof models.select.image>>;
export type Business = Static<TObject<typeof models.select.business>>;
export type User = Static<TObject<typeof models.select.user>>;
export type Admin = Static<TObject<typeof models.select.admin>>;
export type Plan = Static<TObject<typeof models.select.plan>>;
export type CurrentPlan = Static<TObject<typeof models.select.currentPlan>>;
export type Log = Static<TObject<typeof models.select.log>>;
export type Analytics = Static<TObject<typeof models.select.analytics>>;
export type Notification = Static<TObject<typeof models.select.notification>>;
export type Payment = Static<TObject<typeof models.select.payment>>;
export type Profile = Static<TObject<typeof models.select.profile>>;
export type Trial = Static<TObject<typeof models.select.trial>>;
export type WebhookEvent = Static<TObject<typeof models.select.webhookEvent>>;
export type Session = Static<TObject<typeof models.select.session>>;
export type Account = Static<TObject<typeof models.select.account>>;
export type Verification = Static<TObject<typeof models.select.verification>>;
export type TwoFactor = Static<TObject<typeof models.select.twoFactor>>;
export type BusinessView = Static<TObject<typeof models.select.businessView>>;

// ============================================
// INSERT TYPES (DTOs)
// ============================================

export type ProductInsert = Static<TObject<typeof models.insert.product>>;
export type CategoryInsert = Static<TObject<typeof models.insert.category>>;
export type ImageInsert = Static<TObject<typeof models.insert.image>>;
export type BusinessInsert = Static<TObject<typeof models.insert.business>>;
export type UserInsert = Static<TObject<typeof models.insert.user>>;
export type AdminInsert = Static<TObject<typeof models.insert.admin>>;
export type PlanInsert = Static<TObject<typeof models.insert.plan>>;
export type CurrentPlanInsert = Static<
  TObject<typeof models.insert.currentPlan>
>;
export type LogInsert = Static<TObject<typeof models.insert.log>>;
export type AnalyticsInsert = Static<TObject<typeof models.insert.analytics>>;
export type NotificationInsert = Static<
  TObject<typeof models.insert.notification>
>;
export type PaymentInsert = Static<TObject<typeof models.insert.payment>>;
export type ProfileInsert = Static<TObject<typeof models.insert.profile>>;
export type TrialInsert = Static<TObject<typeof models.insert.trial>>;
export type WebhookEventInsert = Static<
  TObject<typeof models.insert.webhookEvent>
>;
export type SessionInsert = Static<TObject<typeof models.insert.session>>;
export type AccountInsert = Static<TObject<typeof models.insert.account>>;
export type VerificationInsert = Static<
  TObject<typeof models.insert.verification>
>;
export type TwoFactorInsert = Static<TObject<typeof models.insert.twoFactor>>;
export type BusinessViewInsert = Static<
  TObject<typeof models.insert.businessView>
>;

// ============================================
// DTO INSERT TYPES (API Input with Relations)
// ============================================

export type ProductInsertDto = Static<typeof models.dto.insert.product>;
export type BusinessInsertDto = Static<typeof models.dto.insert.business>;

// ============================================
// UPDATE TYPES (DTOs)
// ============================================

export type ProductUpdate = Static<TObject<typeof models.update.product>>;
export type CategoryUpdate = Static<TObject<typeof models.update.category>>;
export type ImageUpdate = Static<TObject<typeof models.update.image>>;
export type BusinessUpdate = Static<TObject<typeof models.update.business>>;
export type UserUpdate = Static<TObject<typeof models.update.user>>;
export type AdminUpdate = Static<TObject<typeof models.update.admin>>;
export type PlanUpdate = Static<TObject<typeof models.update.plan>>;
export type CurrentPlanUpdate = Static<
  TObject<typeof models.update.currentPlan>
>;
export type LogUpdate = Static<TObject<typeof models.update.log>>;
export type AnalyticsUpdate = Static<TObject<typeof models.update.analytics>>;
export type NotificationUpdate = Static<
  TObject<typeof models.update.notification>
>;
export type PaymentUpdate = Static<TObject<typeof models.update.payment>>;
export type ProfileUpdate = Static<TObject<typeof models.update.profile>>;
export type TrialUpdate = Static<TObject<typeof models.update.trial>>;
export type WebhookEventUpdate = Static<
  TObject<typeof models.update.webhookEvent>
>;
export type SessionUpdate = Static<TObject<typeof models.update.session>>;
export type AccountUpdate = Static<TObject<typeof models.update.account>>;
export type VerificationUpdate = Static<
  TObject<typeof models.update.verification>
>;
export type TwoFactorUpdate = Static<TObject<typeof models.update.twoFactor>>;
export type BusinessViewUpdate = Static<
  TObject<typeof models.update.businessView>
>;

// ============================================
// DTO UPDATE TYPES (API Input with Relations)
// ============================================

export type ProductUpdateDto = Static<typeof models.dto.update.product>;

// ============================================
// RELATIONS TYPES
// ============================================

export type ProductWithRelations = Static<
  typeof models.relations.productWithRelations
>;
export type BusinessWithRelations = Static<
  typeof models.relations.businessWithRelations
>;
export type CurrentPlanWithRelations = Static<
  typeof models.relations.currentPlanWithRelations
>;
export type ProfileWithRelations = Static<
  typeof models.relations.profileWithRelations
>;
export type NotificationWithRelations = Static<
  typeof models.relations.notificationWithRelations
>;
export type PaymentWithRelations = Static<
  typeof models.relations.paymentWithRelations
>;
export type TrialWithRelations = Static<
  typeof models.relations.trialWithRelations
>;
export type UserWithRelations = Static<
  typeof models.relations.userWithRelations
>;
export type SessionWithRelations = Static<
  typeof models.relations.sessionWithRelations
>;
export type AccountWithRelations = Static<
  typeof models.relations.accountWithRelations
>;
export type BusinessViewWithRelations = Static<
  typeof models.relations.businessViewWithRelations
>;

/* ENUMS */

export type BusinessStatus =
  (typeof models.enums.businessStatus.enumValues)[number];
export type ListPriority =
  (typeof models.enums.listPriority.enumValues)[number];
export type NotificationType =
  (typeof models.enums.notificationType.enumValues)[number];
export type Permission = (typeof models.enums.permission.enumValues)[number];
export type PlanStatus = (typeof models.enums.planStatus.enumValues)[number];
export type PlanType = (typeof models.enums.planType.enumValues)[number];
export type UserRole = (typeof models.enums.userRole.enumValues)[number];
