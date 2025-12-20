ALTER TABLE "plan" RENAME COLUMN "max_images" TO "max_images_per_product";--> statement-breakpoint
ALTER TABLE "plan" ADD COLUMN "details" json DEFAULT '{"products": "10", "images": "5", "priority": "Basic"}'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "plan" ADD COLUMN "popular" boolean DEFAULT false NOT NULL;