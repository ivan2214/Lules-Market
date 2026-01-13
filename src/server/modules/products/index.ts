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
          response: ProductModel.arrayProductsOutput, // using a wrapper object success:true is part of default response structure often but here defined explicitly
        },
      )
      .get(
        "/list",
        async ({ query }) => {
          return await ProductService.listAll(query);
        },
        {
          query: ProductModel.listAllInput,
          response: ProductModel.productsListOutput,
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
      .get(
        "/by-business",
        async ({ currentBusiness }) => {
          const products = await ProductService.getByBusiness(
            currentBusiness.id,
          );
          return { success: true, products };
        },
        {
          currentBusiness: true,
          isBusiness: true,
        },
      )
      .post(
        "/",
        async ({ body, currentBusiness }) => {
          return await ProductService.create(body, currentBusiness.id);
        },
        {
          currentBusiness: true,
          isBusiness: true,
          body: ProductModel.createBody,
        },
      )
      .put(
        "/",
        async ({ body, currentBusiness }) => {
          return await ProductService.update(body, currentBusiness.id);
        },
        {
          currentBusiness: true,
          isBusiness: true,
          body: ProductModel.updateBody,
        },
      )
      .delete(
        "/",
        async ({ query, currentBusiness }) => {
          return await ProductService.delete(
            query.productId,
            currentBusiness.id,
          );
        },
        {
          currentBusiness: true,
          isBusiness: true,
          query: ProductModel.deleteQuery,
        },
      ),
  );
