import Elysia, { t } from "elysia";
import { models } from "@/db/model";
import { authPlugin } from "../plugins/auth";
import {
  getPublicProfileService,
  getUserByEmailService,
  getUserByIdService,
  syncUserRoleService,
} from "../services/user";

export const userRouter = new Elysia({
  prefix: "/user",
})
  .use(authPlugin)
  .get(
    "/public-profile/:userId",
    async ({ params }) => {
      return await getPublicProfileService(params.userId);
    },
    {
      params: t.Object({
        userId: t.String(),
      }),
    },
  )
  .get(
    "/by-email",
    async ({ query }) => {
      return await getUserByEmailService(query.email);
    },
    {
      query: t.Object({
        email: t.String(),
      }),
      response: t.Nullable(t.Object(models.select.user)),
    },
  )
  .get(
    "/by-id/:id",
    async ({ params }) => {
      return await getUserByIdService(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .post(
    "/sync-role",
    async ({ body }) => {
      return await syncUserRoleService({ id: body.id, email: body.email });
    },
    {
      body: t.Object({
        id: t.String(),
        email: t.String(),
      }),
    },
  );
