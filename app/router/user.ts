import "server-only";
import { os } from "@orpc/server";
import z from "zod";
import type { ProfileWithRelations, User } from "@/db/types";
import {
  getPublicProfileCached,
  getUserByEmailCached,
  getUserByIdCached,
} from "../data/user/user.dal";

export const getPublicProfile = os
  .route({
    method: "GET",
  })
  .input(
    z.object({
      userId: z.string(),
    }),
  )
  .output(z.custom<ProfileWithRelations>().nullable())
  .handler(async ({ input }) => {
    return await getPublicProfileCached(input.userId);
  });

export const getUserByEmail = os
  .route({
    method: "GET",
  })
  .input(
    z.object({
      email: z.string(),
    }),
  )
  .output(z.custom<User>().nullable())
  .handler(async ({ input }) => {
    return await getUserByEmailCached(input.email);
  });

export const getUserById = os
  .route({
    method: "GET",
  })
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .output(z.custom<User>().nullable())
  .handler(async ({ input }) => {
    return await getUserByIdCached(input.id);
  });

export const userRoute = os.router({
  getPublicProfile,
  getUserByEmail,
  getUserById,
});
