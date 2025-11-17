/*
  Warnings:

  - You are about to drop the column `userProfileId` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `city` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `profile` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Post_userProfileId_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "userProfileId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profile" DROP CONSTRAINT "profile_pkey",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "firstName",
DROP COLUMN "id",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");
