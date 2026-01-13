import { handleRequest, type Router, route } from "@better-upload/server";
import { Elysia } from "elysia";
import { env } from "@/env/server";
import { s3 } from "@/lib/s3";
import { UploadService } from "./service";

const router: Router = {
  client: s3,
  bucketName: env.S3_BUCKET_NAME,
  routes: {
    businessCover: route({
      fileTypes: ["image/*"],
      multipleFiles: false,
      onBeforeUpload: async () => {
        return UploadService.handleBusinessCoverUpload();
      },
    }),
    businessLogo: route({
      fileTypes: ["image/*"],
      multipleFiles: false,
      onBeforeUpload: async () => {
        return UploadService.handleBusinessLogoUpload();
      },
    }),
    productsImages: route({
      fileTypes: ["image/*"],
      multipleFiles: true,
      maxFileSize: 1024 * 1024 * 4, // 4MB
      onBeforeUpload: async () => {
        return await UploadService.handleProductsImagesUpload();
      },
    }),
  },
};

export const uploadRoute = new Elysia({ prefix: "/api" }).post(
  "/upload",
  ({ request }) => {
    return handleRequest(request, router);
  },
);
