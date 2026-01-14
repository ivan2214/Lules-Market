import { Elysia } from "elysia";
import { authPlugin } from "@/server/plugins/auth";
import { UserModel } from "./model";
import { UserService } from "./service";

export const userController = new Elysia({
  prefix: "/user",
})
  .use(authPlugin)
  .get(
    "/public-profile/:userId",
    async ({ params }) => {
      return await UserService.getPublicProfile(params.userId);
    },
    {
      params: UserModel.userIdParams,
    },
  )
  .get(
    "/by-email",
    async ({ query }) => {
      return await UserService.getByEmail(query.email);
    },
    {
      query: UserModel.emailQuery,
      response: UserModel.userOutput,
    },
  )
  .get(
    "/by-id/:id",
    async ({ params }) => {
      return await UserService.getById(params.id);
    },
    {
      params: UserModel.idParams,
    },
  )
  .post(
    "/sync-role",
    async ({ body }) => {
      return await UserService.syncRole({ id: body.id, email: body.email });
    },
    {
      body: UserModel.syncRoleBody,
    },
  );
