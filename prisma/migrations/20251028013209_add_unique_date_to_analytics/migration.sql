/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `Analytics` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Analytics" ALTER COLUMN "date" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_date_key" ON "Analytics"("date");
