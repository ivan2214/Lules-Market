import { Elysia } from "elysia";
import { authPlugin } from "@/server/plugins/auth";
import { BusinessModel } from "./model";
import { BusinessService } from "./service";

export const businessController = new Elysia({
  name: "BusinessModule",
  prefix: "/business",
});

const publicRoutes = new Elysia({ prefix: "/public", tags: ["Business"] })
  .get(
    "/featured",
    async () => {
      return await BusinessService.getFeatured();
    },
    {
      response: BusinessModel.featuredOutput,
    },
  )
  .get(
    "/list-all",
    async ({ query }) => {
      return await BusinessService.listAll(query);
    },
    {
      query: BusinessModel.listAllInput,
      response: BusinessModel.listAllOutput,
    },
  )
  .get(
    "/get-business-by-id",
    async ({ query }) => {
      return await BusinessService.getById(query.id);
    },
    {
      query: BusinessModel.getByIdInput,
    },
  )
  .get(
    "/list-similar",
    async ({ query }) => {
      return await BusinessService.listSimilar(query);
    },
    {
      query: BusinessModel.listSimilarInput,
      response: BusinessModel.listSimilarOutput,
    },
  )
  .post(
    "/trackView/:businessId",
    async ({ params, body }) => {
      return await BusinessService.trackView(params.businessId, body.referrer);
    },
    {
      params: BusinessModel.trackViewParams,
      body: BusinessModel.trackViewInput,
    },
  )
  .post(
    "/setup",
    async ({ body }) => {
      return await BusinessService.setup(body);
    },
    {
      body: BusinessModel.setup,
      response: BusinessModel.setupOutput,
    },
  );

const privateRoutes = new Elysia({ prefix: "/private" })
  .use(authPlugin)
  .get(
    "/my-products",
    async ({ query, currentBusiness }) => {
      return await BusinessService.getMyProducts(
        currentBusiness.id,
        query.limit ?? 12,
        ((query.page ?? 1) - 1) * (query.limit ?? 12),
      );
    },
    {
      currentBusiness: true,
      isBusiness: true,
      query: BusinessModel.listAllInput, // Reusing limit/offset from listAllInput for pagination
    },
  )
  .post(
    "/update",
    async ({ body, user }) => {
      return await BusinessService.update(user.id, body);
    },
    {
      body: BusinessModel.update,
      isBusiness: true,
    },
  )
  .delete(
    "/delete",
    async ({ user }) => {
      return await BusinessService.delete(user.id);
    },
    {
      isBusiness: true,
    },
  );

export const businessModule = businessController
  .use(publicRoutes)
  .use(privateRoutes);
