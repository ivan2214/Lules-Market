import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import {
  account,
  admin,
  analytics,
  business,
  businessStatusEnum,
  businessView,
  category,
  currentPlan,
  image,
  listPriorityEnum,
  log,
  notification,
  notificationTypeEnum,
  payment,
  permissionEnum,
  plan,
  planStatusEnum,
  planTypeEnum,
  product,
  profile,
  session,
  trial,
  twoFactor,
  user,
  userRoleEnum,
  verification,
  webhookEvent,
} from "../schema";

import { spreads } from "./utils";

const dateSchema = t.Union([t.Date(), t.String(), t.Null()]);

const timestampSchema = {
  createdAt: dateSchema,
  updatedAt: dateSchema,
};

const timestampOnlySchema = {
  createdAt: dateSchema,
};

// ============================================
// BASE SCHEMAS (sin relaciones)
// ============================================

const productBase = createSelectSchema(product, timestampSchema);
const categoryBase = createSelectSchema(category, timestampSchema);
const imageBase = createSelectSchema(image, timestampSchema);
const businessBase = createSelectSchema(business, timestampSchema);
const userBase = createSelectSchema(user, {
  ...timestampSchema,
});
const adminBase = createSelectSchema(admin, timestampSchema);
const planBase = createSelectSchema(plan, timestampSchema);
const currentPlanBase = createSelectSchema(currentPlan, {
  ...timestampSchema,
  expiresAt: dateSchema,
  activatedAt: dateSchema,
});
const logBase = createSelectSchema(log, {
  timestamp: dateSchema,
});
const analyticsBase = createSelectSchema(analytics, {
  date: dateSchema,
});
const notificationBase = createSelectSchema(notification, {
  ...timestampOnlySchema,
  readAt: dateSchema,
});
const paymentBase = createSelectSchema(payment, timestampSchema);
const profileBase = createSelectSchema(profile);
const trialBase = createSelectSchema(trial, {
  ...timestampSchema,
  expiresAt: dateSchema,
  activatedAt: dateSchema,
});
const webhookEventBase = createSelectSchema(webhookEvent, {
  ...timestampOnlySchema,
  processedAt: dateSchema,
});
const sessionBase = createSelectSchema(session, {
  ...timestampSchema,
  expiresAt: dateSchema,
});
const accountBase = createSelectSchema(account, {
  ...timestampSchema,
  accessTokenExpiresAt: dateSchema,
  refreshTokenExpiresAt: dateSchema,
});
const verificationBase = createSelectSchema(verification, {
  ...timestampSchema,
  expiresAt: dateSchema,
});
const twoFactorBase = createSelectSchema(twoFactor);
const businessViewBase = createSelectSchema(businessView);

// ============================================
// SCHEMAS CON RELACIONES
// ============================================

// Logo schema (es una imagen)
const logoSchema = t.Object({
  ...imageBase.properties,
});

const coverImageSchema = t.Object({
  ...imageBase.properties,
});

const categorySchema = t.Object({
  ...categoryBase.properties,
});

// Product schema with downstream relations (Images, Category) but NO upstream (Business)
// This avoids circular dependencies when used inside Business.
const productWithDownstreamRelationsSchema = t.Object({
  ...productBase.properties,
  images: t.Optional(t.Nullable(t.Array(imageBase))),
  category: t.Optional(t.Nullable(categorySchema)),
});

// CurrentPlan con plan anidado
const currentPlanWithRelationsSchema = t.Object({
  ...currentPlanBase.properties,
  plan: t.Optional(
    t.Nullable(
      t.Object({
        ...planBase.properties,
      }),
    ),
  ),
  business: t.Optional(
    t.Nullable(
      t.Object({
        ...businessBase.properties,
        user: t.Optional(t.Nullable(userBase)),
      }),
    ),
  ),
});

// Business con relaciones
const businessWithRelationsSchema = t.Object({
  ...businessBase.properties,
  currentPlan: t.Optional(t.Nullable(currentPlanWithRelationsSchema)),
  logo: t.Optional(t.Nullable(logoSchema)),
  coverImage: t.Optional(t.Nullable(coverImageSchema)),
  category: t.Optional(t.Nullable(categorySchema)),
  // Use schema that includes images/category
  products: t.Optional(
    t.Nullable(t.Array(productWithDownstreamRelationsSchema)),
  ),
  user: t.Optional(t.Nullable(userBase)),
});

// Product con todas sus relaciones (incluyendo upstream Business)
const productWithRelationsSchema = t.Object({
  ...productWithDownstreamRelationsSchema.properties, // Reuse downstream props
  business: t.Optional(t.Nullable(businessWithRelationsSchema)),
});

// Profile con relaciones using Base schemas to avoid cycles where possible,
// or simple nesting where tree structure is clear
const profileWithRelationsSchema = t.Object({
  ...profileBase.properties,
  user: t.Optional(t.Nullable(userBase)),
  avatar: t.Optional(t.Nullable(logoSchema)),
});

const notificationWithRelationsSchema = t.Object({
  ...notificationBase.properties,
  user: t.Optional(t.Nullable(userBase)),
});

// Payment relates to Business
const paymentWithRelationsSchema = t.Object({
  ...paymentBase.properties,
  business: t.Optional(t.Nullable(businessBase)),
});

// Trial relates to Business
const trialWithRelationsSchema = t.Object({
  ...trialBase.properties,
  business: t.Optional(t.Nullable(businessBase)),
});

// BusinessView relates to Business
const businessViewWithRelationsSchema = t.Object({
  ...businessViewBase.properties,
  business: t.Optional(t.Nullable(businessBase)),
});

// Session, Account, TwoFactor relate to User
const sessionWithRelationsSchema = t.Object({
  ...sessionBase.properties,
  user: t.Optional(t.Nullable(userBase)),
});

const accountWithRelationsSchema = t.Object({
  ...accountBase.properties,
  user: t.Optional(t.Nullable(userBase)),
});

const _twoFactorWithRelationsSchema = t.Object({
  ...twoFactorBase.properties,
  user: t.Optional(t.Nullable(userBase)),
});

// User with relations (Cycle handling: use Base for back-references)
const userWithRelationsSchema = t.Object({
  ...userBase.properties,
  profile: t.Optional(t.Nullable(profileBase)),
  business: t.Optional(t.Nullable(businessBase)),
  sessions: t.Optional(t.Nullable(t.Array(sessionBase))),
  accounts: t.Optional(t.Nullable(t.Array(accountBase))),
  notifications: t.Optional(t.Nullable(t.Array(notificationBase))),
});

const adminWithRelationsSchema = t.Object({
  ...adminBase.properties,
  user: t.Optional(t.Nullable(userBase)),
});

// ============================================
// BASE INSERT SCHEMAS (Pure Table)
// ============================================

const productInsert = createInsertSchema(product, {
  name: t.String({ minLength: 1, error: "Name is required" }),
  description: t.Optional(
    t.String({ minLength: 1, error: "Description is required" }),
  ),
  price: t.Optional(t.Number({ minimum: 0, error: "Price must be positive" })),
  active: t.Optional(t.Boolean()),
});
const categoryInsert = createInsertSchema(category, timestampSchema);
const imageInsert = createInsertSchema(image);
const businessInsert = createInsertSchema(business, timestampSchema);
const userInsert = createInsertSchema(user, timestampSchema);
const adminInsert = createInsertSchema(admin);
const planInsert = createInsertSchema(plan);
const currentPlanInsert = createInsertSchema(currentPlan, {
  ...timestampSchema,
  expiresAt: dateSchema,
  activatedAt: dateSchema,
});
const logInsert = createInsertSchema(log);
const analyticsInsert = createInsertSchema(analytics);
const notificationInsert = createInsertSchema(
  notification,
  timestampOnlySchema,
);
const paymentInsert = createInsertSchema(payment);
const profileInsert = createInsertSchema(profile, timestampSchema);
const trialInsert = createInsertSchema(trial, {
  ...timestampSchema,
  expiresAt: dateSchema,
  activatedAt: dateSchema,
});
const webhookEventInsert = createInsertSchema(webhookEvent, {
  processedAt: dateSchema,
});
const sessionInsert = createInsertSchema(session, {
  ...timestampSchema,
  expiresAt: dateSchema,
});
const accountInsert = createInsertSchema(account, {
  ...timestampSchema,
  accessTokenExpiresAt: dateSchema,
  refreshTokenExpiresAt: dateSchema,
});
const verificationInsert = createInsertSchema(verification, {
  ...timestampSchema,
  expiresAt: dateSchema,
});
const twoFactorInsert = createInsertSchema(twoFactor);
const businessViewInsert = createInsertSchema(
  businessView,
  timestampOnlySchema,
);

// ============================================
// DTO INSERT SCHEMAS (With Relations)
// ============================================

const productInsertDto = t.Composite([
  productInsert,
  t.Object({
    images: t.Optional(t.Array(imageInsert)),
    category: t.Optional(t.Nullable(categoryInsert)),
  }),
]);

const businessInsertDto = t.Composite([
  businessInsert,
  t.Object({
    logo: t.Optional(t.Nullable(imageInsert)),
    coverImage: t.Optional(t.Nullable(imageInsert)),
    category: t.Optional(t.Nullable(categoryInsert)),
  }),
]);

// ============================================
// EXPORT MODELS
// ============================================

export const models = {
  // Pure Table Schemas (for DB operations)
  insert: spreads(
    {
      product: productInsert,
      category: categoryInsert,
      image: imageInsert,
      business: businessInsert,
      user: userInsert,
      admin: adminInsert,
      plan: planInsert,
      currentPlan: currentPlanInsert,
      log: logInsert,
      analytics: analyticsInsert,
      notification: notificationInsert,
      payment: paymentInsert,
      profile: profileInsert,
      trial: trialInsert,
      webhookEvent: webhookEventInsert,
      session: sessionInsert,
      account: accountInsert,
      verification: verificationInsert,
      twoFactor: twoFactorInsert,
      businessView: businessViewInsert,
    },
    "insert",
  ),
  // DTO Schemas (for API Input)
  dto: {
    insert: {
      product: productInsertDto,
      business: businessInsertDto,
      // Add others as needed
    },
    update: {
      // Logic for update DTOs with relations?
      // For now, let's expose the pure updates in `update` group and special DTOs here
      product: t.Composite([
        t.Partial(productInsert),
        t.Object({
          images: t.Optional(t.Array(imageInsert)),
        }),
      ]),
    },
  },
  // Pure Table Updates (for DB operations - partials)
  update: spreads(
    {
      product: productInsert,
      category: categoryInsert,
      image: imageInsert,
      business: businessInsert,
      user: userInsert,
      admin: adminInsert,
      plan: planInsert,
      currentPlan: currentPlanInsert,
      log: logInsert,
      analytics: analyticsInsert,
      notification: notificationInsert,
      payment: paymentInsert,
      profile: profileInsert,
      trial: trialInsert,
      webhookEvent: webhookEventInsert,
      session: sessionInsert,
      account: accountInsert,
      verification: verificationInsert,
      twoFactor: twoFactorInsert,
      businessView: businessViewInsert,
    },
    "update",
  ),
  select: spreads(
    {
      product: productBase,
      category: categoryBase,
      image: imageBase,
      business: businessBase,
      user: userBase,
      admin: adminBase,
      plan: planBase,
      currentPlan: currentPlanBase,
      log: logBase,
      analytics: analyticsBase,
      notification: notificationBase,
      payment: paymentBase,
      profile: profileBase,
      trial: trialBase,
      webhookEvent: webhookEventBase,
      session: sessionBase,
      account: accountBase,
      verification: verificationBase,
      twoFactor: twoFactorBase,
      businessView: businessViewBase,
    },
    "select",
  ),
  // Schemas con relaciones (no usan spreads)
  relations: {
    adminWithRelations: adminWithRelationsSchema,
    productWithRelations: productWithRelationsSchema,
    businessWithRelations: businessWithRelationsSchema,
    currentPlanWithRelations: currentPlanWithRelationsSchema,
    profileWithRelations: profileWithRelationsSchema,
    notificationWithRelations: notificationWithRelationsSchema,
    paymentWithRelations: paymentWithRelationsSchema,
    trialWithRelations: trialWithRelationsSchema,
    userWithRelations: userWithRelationsSchema,
    sessionWithRelations: sessionWithRelationsSchema,
    accountWithRelations: accountWithRelationsSchema,
    businessViewWithRelations: businessViewWithRelationsSchema,
  },
  enums: {
    planType: planTypeEnum,
    userRole: userRoleEnum,
    permission: permissionEnum,
    planStatus: planStatusEnum,
    listPriority: listPriorityEnum,
    businessStatus: businessStatusEnum,
    notificationType: notificationTypeEnum,
  },
} as const;
