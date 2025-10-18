/*
  Warnings:

  - You are about to drop the column `mpPreferenceId` on the `Payment` table. All the data in the column will be lost.
  - Made the column `mpPaymentId` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "mpPreferenceId",
ALTER COLUMN "mpPaymentId" SET NOT NULL;
