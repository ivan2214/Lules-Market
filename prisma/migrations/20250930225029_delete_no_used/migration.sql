/*
  Warnings:

  - You are about to drop the `Survey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Survey";

-- DropTable
DROP TABLE "public"."SurveyAnswer";

-- DropTable
DROP TABLE "public"."SurveyQuestion";

-- DropTable
DROP TABLE "public"."SurveyResponse";

-- DropEnum
DROP TYPE "public"."QuestionType";
