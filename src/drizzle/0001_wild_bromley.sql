CREATE TYPE "public"."business_status" AS ENUM('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."permission" AS ENUM('ALL', 'BAN_USERS', 'MANAGE_PLANS');--> statement-breakpoint
CREATE TYPE "public"."plan_status" AS ENUM('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('FREE', 'BASIC', 'PREMIUM');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'USER', 'BUSINESS', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE "analytics" (
	"id" text PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"total_trials" integer DEFAULT 0 NOT NULL,
	"active_trials" integer DEFAULT 0 NOT NULL,
	"total_payments" integer DEFAULT 0 NOT NULL,
	"total_revenue" double precision DEFAULT 0 NOT NULL,
	CONSTRAINT "analytics_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "log" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"business_id" text,
	"admin_id" text,
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"details" json
);
--> statement-breakpoint
CREATE TABLE "webhook_event" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"event_type" text NOT NULL,
	"mp_id" text,
	"payload" json NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_event_request_id_unique" UNIQUE("request_id")
);
--> statement-breakpoint
CREATE TABLE "business" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	"phone" text,
	"whatsapp" text,
	"email" text NOT NULL,
	"website" text,
	"facebook" text,
	"instagram" text,
	"address" text,
	"verified" boolean DEFAULT false NOT NULL,
	"status" "business_status" DEFAULT 'PENDING_VERIFICATION' NOT NULL,
	"user_id" text NOT NULL,
	"is_banned" boolean DEFAULT false,
	"tags" text[],
	"category_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_email_unique" UNIQUE("email"),
	CONSTRAINT "business_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "business_view" (
	"id" text PRIMARY KEY NOT NULL,
	"business_id" text NOT NULL,
	"referrer" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "current_plan" (
	"id" text PRIMARY KEY NOT NULL,
	"business_id" text NOT NULL,
	"plan_type" "plan_type" NOT NULL,
	"plan_status" "plan_status" DEFAULT 'INACTIVE' NOT NULL,
	"is_trial" boolean DEFAULT false NOT NULL,
	"products_used" integer DEFAULT 0 NOT NULL,
	"images_used" integer DEFAULT 0 NOT NULL,
	"has_statistics" boolean DEFAULT false NOT NULL,
	"can_feature_products" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp NOT NULL,
	"activated_at" timestamp NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "current_plan_business_id_unique" UNIQUE("business_id")
);
--> statement-breakpoint
CREATE TABLE "plan" (
	"type" "plan_type" PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" double precision NOT NULL,
	"features" text[] NOT NULL,
	"max_products" integer NOT NULL,
	"max_images" integer NOT NULL,
	"has_statistics" boolean DEFAULT false NOT NULL,
	"can_feature_products" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plan_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "trial" (
	"id" text PRIMARY KEY NOT NULL,
	"business_id" text NOT NULL,
	"plan" "plan_type" DEFAULT 'PREMIUM' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"activated_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "trial_business_id_unique" UNIQUE("business_id")
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "image" (
	"key" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"is_main_image" boolean DEFAULT false NOT NULL,
	"name" text,
	"size" double precision,
	"is_reported" boolean DEFAULT false NOT NULL,
	"product_id" text,
	"logo_business_id" text,
	"cover_business_id" text,
	"avatar_id" text,
	"is_banned" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "image_key_unique" UNIQUE("key"),
	CONSTRAINT "image_logo_business_id_unique" UNIQUE("logo_business_id"),
	CONSTRAINT "image_cover_business_id_unique" UNIQUE("cover_business_id"),
	CONSTRAINT "image_avatar_id_unique" UNIQUE("avatar_id")
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" double precision NOT NULL,
	"currency" text DEFAULT 'ARS' NOT NULL,
	"status" text NOT NULL,
	"payment_method" text,
	"mp_payment_id" text,
	"mp_status" text,
	"plan" "plan_type" NOT NULL,
	"business_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_mp_payment_id_unique" UNIQUE("mp_payment_id")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" double precision,
	"featured" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"stock" integer DEFAULT 0,
	"brand" text,
	"business_id" text NOT NULL,
	"is_banned" boolean DEFAULT false,
	"category_id" text,
	"tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_view" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"referrer" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin" (
	"user_id" text PRIMARY KEY NOT NULL,
	"permissions" "permission"[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "banned_business" (
	"id" text PRIMARY KEY NOT NULL,
	"banned_by_id" text NOT NULL,
	"business_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "banned_business_business_id_unique" UNIQUE("business_id")
);
--> statement-breakpoint
CREATE TABLE "banned_images" (
	"id" text PRIMARY KEY NOT NULL,
	"banned_by_id" text NOT NULL,
	"image_key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "banned_images_image_key_unique" UNIQUE("image_key")
);
--> statement-breakpoint
CREATE TABLE "banned_product" (
	"id" text PRIMARY KEY NOT NULL,
	"banned_by_id" text NOT NULL,
	"product_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "banned_product_product_id_unique" UNIQUE("product_id")
);
--> statement-breakpoint
CREATE TABLE "email_verification_token" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_verification_token_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "email_verification_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "password_reset_token" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "user_role" "user_role" DEFAULT 'USER' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_banned" boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX "log_timestamp_idx" ON "log" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "log_businessId_idx" ON "log" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "log_adminId_idx" ON "log" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "log_entityType_idx" ON "log" USING btree ("entity_type");--> statement-breakpoint
CREATE INDEX "log_entityId_idx" ON "log" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "business_categoryId_idx" ON "business" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "business_view_businessId_idx" ON "business_view" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "current_plan_planType_idx" ON "current_plan" USING btree ("plan_type");--> statement-breakpoint
CREATE INDEX "image_productId_idx" ON "image" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "image_coverBusinessId_idx" ON "image" USING btree ("cover_business_id");--> statement-breakpoint
CREATE INDEX "image_logoBusinessId_idx" ON "image" USING btree ("logo_business_id");--> statement-breakpoint
CREATE INDEX "payment_businessId_idx" ON "payment" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "payment_status_idx" ON "payment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "product_businessId_idx" ON "product" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "product_featured_idx" ON "product" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "product_active_idx" ON "product" USING btree ("active");--> statement-breakpoint
CREATE INDEX "product_categoryId_idx" ON "product" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "product_view_productId_idx" ON "product_view" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "banned_business_bannedById_idx" ON "banned_business" USING btree ("banned_by_id");--> statement-breakpoint
CREATE INDEX "banned_images_bannedById_idx" ON "banned_images" USING btree ("banned_by_id");--> statement-breakpoint
CREATE INDEX "banned_product_bannedById_idx" ON "banned_product" USING btree ("banned_by_id");--> statement-breakpoint
CREATE INDEX "email_verification_token_userId_idx" ON "email_verification_token" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "password_reset_token_userId_idx" ON "password_reset_token" USING btree ("user_id");