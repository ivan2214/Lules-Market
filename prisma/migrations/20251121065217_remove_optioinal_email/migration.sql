/*
  Warnings:

  - Made the column `email` on table `Business` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "email" SET NOT NULL;
