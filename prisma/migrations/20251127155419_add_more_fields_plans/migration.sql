-- AlterTable
ALTER TABLE "CurrentPlan" ADD COLUMN     "canFeatureProducts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasStatistics" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "canFeatureProducts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasStatistics" BOOLEAN NOT NULL DEFAULT false;
