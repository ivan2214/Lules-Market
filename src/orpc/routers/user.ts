import "server-only";
import z from "zod";
import {
  getPublicProfileCached,
  getUserByEmailCached,
  getUserByIdCached,
} from "@/core/cache-functions/user";
import type { ProfileWithRelations, User } from "@/db/types";
import { o } from "../context";

export const getPublicProfile = o
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

export const getUserByEmail = o
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

export const getUserById = o
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

export const userRouter = {
  getPublicProfile,
  getUserByEmail,
  getUserById,
};
