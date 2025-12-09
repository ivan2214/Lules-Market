CREATE TYPE "public"."notification_type" AS ENUM('PRODUCT_AVAILABLE', 'PLAN_EXPIRING', 'PLAN_EXPIRED', 'PAYMENT_RECEIVED', 'ACCOUNT_VERIFIED', 'REPORT_RESOLVED');--> statement-breakpoint
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
CREATE INDEX "notification_userId_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_read_idx" ON "notification" USING btree ("read");--> statement-breakpoint
CREATE INDEX "notification_type_idx" ON "notification" USING btree ("type");