-- DropIndex
DROP INDEX "public"."Answer_authorId_key";

-- DropIndex
DROP INDEX "public"."Answer_postId_key";

-- CreateIndex
CREATE INDEX "Answer_authorId_idx" ON "Answer"("authorId");

-- CreateIndex
CREATE INDEX "Answer_postId_idx" ON "Answer"("postId");
