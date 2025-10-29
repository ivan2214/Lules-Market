-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "isBanned" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "isBanned" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isBanned" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isBanned" BOOLEAN DEFAULT false;
