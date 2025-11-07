/*
  Warnings:

  - You are about to drop the column `hours` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `twitter` on the `Business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "hours",
DROP COLUMN "twitter";
