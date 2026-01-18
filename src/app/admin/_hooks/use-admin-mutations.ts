"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { PlanType } from "@/db/types";
import { api } from "@/lib/eden";
import { AppError } from "@/server/errors";

// =====================
// PLAN MUTATIONS
// =====================

export function usePlanMutations() {
  const router = useRouter();

  const updatePlan = useMutation({
    mutationFn: async ({
      type,
      data,
    }: {
      type: PlanType;
      data: {
        price?: number;
        maxProducts?: number;
        name?: string;
        description?: string;
        discount?: number;
        maxImagesPerProduct?: number;
        hasStatistics?: boolean;
        popular?: boolean;
        isActive?: boolean;
      };
    }) => {
      const res = await api.plan.manage({ type }).put({
        ...data,
      });
      if (res.error)
        throw new Error(res.error.value?.message || "Error updating plan");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const pausePlan = useMutation({
    mutationFn: async (type: PlanType) => {
      const res = await api.plan.manage({ type }).pause.patch({});
      if (res.error)
        throw new Error(res.error.value?.message || "Error pausing plan");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const reactivatePlan = useMutation({
    mutationFn: async (type: PlanType) => {
      const res = await api.plan.manage({ type }).reactivate.patch({});
      if (res.error)
        throw new Error(res.error.value?.message || "Error reactivating plan");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return { updatePlan, pausePlan, reactivatePlan };
}

// =====================
// TRIAL MUTATIONS
// =====================

export function useTrialMutations() {
  const router = useRouter();

  const createTrial = useMutation({
    mutationFn: async (data: {
      businessId: string;
      planType: "FREE" | "BASIC" | "PREMIUM";
      endDate: Date;
    }) => {
      const res = await api.admin.trials.create.post(data);
      if (res.error)
        throw new Error(res.error.value?.message || "Error creating trial");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const extendTrial = useMutation({
    mutationFn: async ({
      id,
      newEndDate,
    }: {
      id: string;
      newEndDate: Date;
    }) => {
      const res = await api.admin.trials({ id }).extend.patch({
        newEndDate,
      });
      if (res.error)
        throw new Error(res.error.value?.message || "Error extending trial");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const cancelTrial = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.admin.trials({ id }).cancel.patch({});
      if (res.error)
        throw new Error(res.error.value?.message || "Error canceling trial");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return { createTrial, extendTrial, cancelTrial };
}

// =====================
// ENTITY (USER/BUSINESS) MUTATIONS
// =====================

export function useEntityMutations() {
  const router = useRouter();

  const banUser = useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.admin.entities.user({ id: userId }).ban.patch({});
      if (res.error)
        throw new Error(res.error.value?.message || "Error banning user");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const activateUser = useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.admin.entities
        .user({ id: userId })
        .activate.patch({});
      if (res.error)
        throw new Error(res.error.value?.message || "Error activating user");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const banBusiness = useMutation({
    mutationFn: async (businessId: string) => {
      const res = await api.admin.entities
        .business({ id: businessId })
        .ban.patch({});
      if (res.error)
        throw new Error(res.error.value?.message || "Error banning business");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const activateBusiness = useMutation({
    mutationFn: async (businessId: string) => {
      const res = await api.admin.entities
        .business({ id: businessId })
        .activate.patch({});
      if (res.error)
        throw new Error(
          res.error.value?.message || "Error activating business",
        );
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return { banUser, activateUser, banBusiness, activateBusiness };
}

// =====================
// PRODUCT MUTATIONS
// =====================

export function useProductMutations() {
  const router = useRouter();

  const banProduct = useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.admin.products({ id: productId }).ban.patch({});
      if (res.error)
        throw new Error(res.error.value?.message || "Error banning product");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const pauseProduct = useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.admin.products({ id: productId }).pause.patch({});
      if (res.error)
        throw new Error(res.error.value?.message || "Error pausing product");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const activateProduct = useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.admin
        .products({ id: productId })
        .activate.patch({});
      if (res.error)
        throw new Error(res.error.value?.message || "Error activating product");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return { banProduct, pauseProduct, activateProduct };
}

// =====================
// LOGS MUTATIONS
// =====================

export function useLogsMutations() {
  const router = useRouter();

  const deleteAllLogs = useMutation({
    mutationFn: async () => {
      const res = await api.admin.deleteAllLogs.post({});
      if (res.error instanceof AppError)
        throw new Error(res.error.message || "Error deleting logs");
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return { deleteAllLogs };
}
