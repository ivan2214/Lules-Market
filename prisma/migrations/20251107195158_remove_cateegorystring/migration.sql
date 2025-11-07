/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Product_category_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category";
