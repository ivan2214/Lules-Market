import { Elysia } from "elysia";
import { AppError } from "@/server/errors";
import { authPlugin } from "@/server/plugins/auth";
import { ProductModel } from "./model";
import { ProductService } from "./service";

export const productModule = new Elysia({ prefix: "/products" })
  .use(
    new Elysia({ prefix: "/public" })
      .get(
        "/recent",
        async () => {
          const products = await ProductService.getRecent();
          return { success: true, products };
        },
        {
          response: ProductModel.recentOutput,
        },
      )
      .get(
        "/list",
        async ({ query }) => {
          return await ProductService.listAll(query);
        },
        {
          query: ProductModel.listAllInput,
          response: ProductModel.productsListAllOutput,
        },
      )
      .get(
        "/:id",
        async ({ params }) => {
          return await ProductService.getById(params.id);
        },
        {
          params: ProductModel.idParams,
          response: ProductModel.productOutput,
        },
      )
      .get(
        "/:id/similar",
        async ({ params }) => {
          const products = await ProductService.getSimilar(
            params.categoryId,
            params.id,
          );
          return { products };
        },
        {
          params: ProductModel.similarParams,
          response: ProductModel.arrayProductsOutput,
        },
      )
      .post(
        "/trackView/:productId",
        async ({ params, body }) => {
          return await ProductService.trackView(
            params.productId,
            body.referrer,
          );
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
