CREATE TYPE "public"."business_status" AS ENUM('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."list_priority" AS ENUM('Estandar', 'Media', 'Alta');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('PRODUCT_AVAILABLE', 'PLAN_EXPIRING', 'PLAN_EXPIRED', 'PAYMENT_RECEIVED', 'ACCOUNT_VERIFIED', 'REPORT_RESOLVED');--> statement-breakpoint
CREATE TYPE "public"."permission" AS ENUM('ALL', 'BAN_USERS', 'MANAGE_PLANS', 'MANAGE_PAYMENTS', 'MODERATE_CONTENT', 'VIEW_ANALYTICS');--> statement-breakpoint
CREATE TYPE "public"."plan_status" AS ENUM('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('FREE', 'BASIC', 'PREMIUM');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'USER', 'BUSINESS', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE "admin" (
	"user_id" text PRIMARY KEY NOT NULL,
	"permissions" "permission"[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
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
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "two_factor" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"two_factor_enabled" boolean DEFAULT false,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	"phone" text,
	"whatsapp" text,
	"website" text,
	"facebook" text,
	"instagram" text,
	"address" text,
	"verified" boolean DEFAULT false NOT NULL,
	"status" "business_status" DEFAULT 'PENDING_VERIFICATION' NOT NULL,
	"user_id" text NOT NULL,
	"tags" text[],
	"category_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
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
CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_value_unique" UNIQUE("value")
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
	"expires_at" timestamp NOT NULL,
	"activated_at" timestamp NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"list_priority" "list_priority" DEFAULT 'Estandar' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "current_plan_business_id_unique" UNIQUE("business_id")
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "image_key_unique" UNIQUE("key"),
	CONSTRAINT "image_logo_business_id_unique" UNIQUE("logo_business_id"),
	CONSTRAINT "image_cover_business_id_unique" UNIQUE("cover_business_id"),
	CONSTRAINT "image_avatar_id_unique" UNIQUE("avatar_id")
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
CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL,
	"action_url" text,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp
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
CREATE TABLE "plan" (
	"type" "plan_type" PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" double precision NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"features" text[] NOT NULL,
	"max_products" integer NOT NULL,
	"max_images_per_product" integer NOT NULL,
	"has_statistics" boolean DEFAULT false NOT NULL,
	"details" json NOT NULL,
	"popular" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"list_priority" "list_priority" DEFAULT 'Estandar' NOT NULL,
	CONSTRAINT "plan_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" double precision,
	"discount" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"stock" integer DEFAULT 0,
	"brand" text,
	"business_id" text NOT NULL,
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
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "twoFactor_secret_idx" ON "two_factor" USING btree ("secret");--> statement-breakpoint
CREATE INDEX "twoFactor_userId_idx" ON "two_factor" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "business_categoryId_idx" ON "business" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "business_view_businessId_idx" ON "business_view" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "current_plan_planType_idx" ON "current_plan" USING btree ("plan_type");--> statement-breakpoint
CREATE INDEX "image_productId_idx" ON "image" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "image_coverBusinessId_idx" ON "image" USING btree ("cover_business_id");--> statement-breakpoint
CREATE INDEX "image_logoBusinessId_idx" ON "image" USING btree ("logo_business_id");--> statement-breakpoint
CREATE INDEX "log_timestamp_idx" ON "log" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "log_businessId_idx" ON "log" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "log_adminId_idx" ON "log" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "log_entityType_idx" ON "log" USING btree ("entity_type");--> statement-breakpoint
CREATE INDEX "log_entityId_idx" ON "log" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "notification_userId_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_read_idx" ON "notification" USING btree ("read");--> statement-breakpoint
CREATE INDEX "notification_type_idx" ON "notification" USING btree ("type");--> statement-breakpoint
CREATE INDEX "payment_businessId_idx" ON "payment" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "payment_status_idx" ON "payment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "product_businessId_idx" ON "product" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "product_active_idx" ON "product" USING btree ("active");--> statement-breakpoint
CREATE INDEX "product_categoryId_idx" ON "product" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "product_view_productId_idx" ON "product_view" USING btree ("product_id");