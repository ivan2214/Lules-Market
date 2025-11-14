/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `helpfulCount` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteBusiness` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReportedBusiness` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReportedProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReportedQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReportedReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReviewImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BusinessToCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BusinessToSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductToSubCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "public"."Image_categoryId_key";

-- DropIndex
DROP INDEX "public"."Image_subCategoryId_key";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "categoryId",
DROP COLUMN "subCategoryId";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "helpfulCount";

-- DropTable
DROP TABLE "public"."Answer";

-- DropTable
DROP TABLE "public"."FavoriteBusiness";

-- DropTable
DROP TABLE "public"."FavoriteProduct";

-- DropTable
DROP TABLE "public"."Question";

-- DropTable
DROP TABLE "public"."ReportedBusiness";

-- DropTable
DROP TABLE "public"."ReportedProduct";

-- DropTable
DROP TABLE "public"."ReportedQuestion";

-- DropTable
DROP TABLE "public"."ReportedReview";

-- DropTable
DROP TABLE "public"."ReviewImage";

-- DropTable
DROP TABLE "public"."SubCategory";

-- DropTable
DROP TABLE "public"."_BusinessToCategory";

-- DropTable
DROP TABLE "public"."_BusinessToSubCategory";

-- DropTable
DROP TABLE "public"."_CategoryToProduct";

-- DropTable
DROP TABLE "public"."_ProductToSubCategory";

-- DropEnum
DROP TYPE "public"."ReportStatus";

-- CreateIndex
CREATE INDEX "Business_categoryId_idx" ON "Business"("categoryId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
