import z from "zod";

export const LogInsertSchema = z.object({
  businessId: z.string().optional(),
  adminId: z.string().optional(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  details: z.unknown().optional(),
});
