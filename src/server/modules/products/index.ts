import { Elysia } from "elysia";
import { AppError } from "@/server/errors";
import { authPlugin } from "@/server/plugins/auth";
import { ProductModel } from "./model";
import { ProductService } from "./service";

export const productModule = new Elysia({ prefix: "/products" })
  .use(
    new Elysia({ prefix: "/public" }).post(
      "/trackView/:productId",
      async ({ params, body }) => {
        return await ProductService.trackView(params.productId, body.referrer);
      },
      {
        params: ProductModel.trackViewParams,
        body: ProductModel.trackViewBody,
      },
    ),
  )
  .use(
    new Elysia({ prefix: "/private" })
      .use(authPlugin)

      .post(
        "/",
        async ({ body, isBusiness, business }) => {
          if (!isBusiness || !business)
            throw new AppError("Unauthorized", "UNAUTHORIZED");
          return await ProductService.create(body, business.id);
        },
        {
          isBusiness: true,
          body: ProductModel.createBody,
        },
      )
      .put(
        "/",
        async ({ body, isBusiness, business }) => {
          if (!isBusiness || !business)
            throw new AppError("Unauthorized", "UNAUTHORIZED");
          return await ProductService.update(body, business.id);
        },
        {
          isBusiness: true,
          body: ProductModel.updateBody,
        },
      )
      .delete(
        "/",
        async ({ query, isBusiness, business }) => {
          if (!isBusiness || !business)
            throw new AppError("Unauthorized", "UNAUTHORIZED");
          return await ProductService.delete(query.productId, business.id);
        },
        {
          isBusiness: true,
          query: ProductModel.deleteQuery,
        },
      ),
  );
