/*
  Warnings:

  - You are about to drop the column `isAnswer` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isAnswer";

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isAnon" BOOLEAN NOT NULL DEFAULT false,
    "isBest" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Answer_postId_key" ON "Answer"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_authorId_key" ON "Answer"("authorId");
