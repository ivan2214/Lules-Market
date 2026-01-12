CREATE INDEX "business_isActive_categoryId_idx" ON "business" USING btree ("is_active","category_id");--> statement-breakpoint
CREATE INDEX "business_isActive_createdAt_idx" ON "business" USING btree ("is_active","created_at");--> statement-breakpoint
CREATE INDEX "product_active_businessId_categoryId_idx" ON "product" USING btree ("active","business_id","category_id");--> statement-breakpoint
CREATE INDEX "product_active_createdAt_idx" ON "product" USING btree ("active","created_at");