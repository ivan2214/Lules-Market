import { Elysia } from "elysia";
import { CategoryModel } from "./model";
import { CategoryService } from "./service";

export const categoryModule = new Elysia({
  prefix: "/category",
}).group("/public", (app) =>
  app.get(
    "/list-all",
    async () => {
      return await CategoryService.listAll();
    },
    {
      response: CategoryModel.listAllOutput,
    },
  ),
);
