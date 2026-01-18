import "server-only";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "@/db";
import { plan } from "@/db/schema";
import type { Plan, PlanType } from "@/db/types";
import { CACHE_KEYS, CACHE_TTL, getCachedOrFetch } from "@/lib/cache";
import { AppError } from "@/server/errors";

// Local helper function to match private logic
async function fetchPlans(): Promise<Plan[] | null> {
  const plans = await db.query.plan.findMany();
  return plans;
}

export const PlanService = {
  async listAll(): Promise<Plan[] | null> {
    return getCachedOrFetch(CACHE_KEYS.PLANS_ALL, fetchPlans, CACHE_TTL.PLANS);
  },

  async getByType(planType: PlanType): Promise<Plan | null> {
    return getCachedOrFetch(
      CACHE_KEYS.plan(planType),
      async () => {
        try {
          const result = await db.query.plan.findFirst({
            where: eq(plan.type, planType),
          });
          return result ?? null;
        } catch (error) {
          console.error("Error al obtener el plan:", error);
          return null;
        }
      },
      CACHE_TTL.PLANS,
    );
  },

  // =====================
  // MUTATION METHODS
  // =====================

  async updatePlan(
    planType: PlanType,
    data: Partial<Omit<Plan, "type" | "createdAt" | "updatedAt">>,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const existingPlan = await db.query.plan.findFirst({
        where: eq(plan.type, planType),
      });

      if (!existingPlan) {
        throw new AppError(`Plan ${planType} not found`, "NOT_FOUND");
      }

      await db
        .update(plan)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(plan.type, planType));
      revalidateTag("plans", "max");
      return {
        success: true,
        message: `Plan ${planType} updated successfully`,
      };
    } catch (error) {
      console.error("Error updating plan:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error updating plan", "INTERNAL_SERVER_ERROR");
    }
  },

  async deletePlan(
    planType: PlanType,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Don't allow deleting FREE plan as it's the default
      if (planType === "FREE") {
        throw new AppError("Cannot delete the FREE plan", "BAD_REQUEST");
      }

      const existingPlan = await db.query.plan.findFirst({
        where: eq(plan.type, planType),
      });

      if (!existingPlan) {
        throw new AppError(`Plan ${planType} not found`, "NOT_FOUND");
      }

      await db.delete(plan).where(eq(plan.type, planType));
      revalidateTag("plans", "max");

      return {
        success: true,
        message: `Plan ${planType} deleted successfully`,
      };
    } catch (error) {
      console.error("Error deleting plan:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error deleting plan", "INTERNAL_SERVER_ERROR");
    }
  },

  async pausePlan(
    planType: PlanType,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Don't allow pausing FREE plan
      if (planType === "FREE") {
        throw new AppError("Cannot pause the FREE plan", "BAD_REQUEST");
      }

      const existingPlan = await db.query.plan.findFirst({
        where: eq(plan.type, planType),
      });

      if (!existingPlan) {
        throw new AppError(`Plan ${planType} not found`, "NOT_FOUND");
      }

      await db
        .update(plan)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(plan.type, planType));

      revalidateTag("plans", "max");
      return { success: true, message: `Plan ${planType} paused successfully` };
    } catch (error) {
      console.error("Error pausing plan:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error pausing plan", "INTERNAL_SERVER_ERROR");
    }
  },

  async reactivatePlan(
    planType: PlanType,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const existingPlan = await db.query.plan.findFirst({
        where: eq(plan.type, planType),
      });

      if (!existingPlan) {
        throw new AppError(`Plan ${planType} not found`, "NOT_FOUND");
      }

      await db
        .update(plan)
        .set({ isActive: true, updatedAt: new Date() })
        .where(eq(plan.type, planType));
      revalidateTag("plans", "max");

      return {
        success: true,
        message: `Plan ${planType} reactivated successfully`,
      };
    } catch (error) {
      console.error("Error reactivating plan:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error reactivating plan", "INTERNAL_SERVER_ERROR");
    }
  },
};
