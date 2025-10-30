/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plan_type_key" ON "Plan"("type");
