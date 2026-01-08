import { RejectUpload, type Router, route } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { tigris } from "@better-upload/server/clients";
import { env } from "@/env/server";
import { getSession } from "@/orpc/actions/user/get-session";

const router: Router = {
  client: tigris({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    endpoint: env.AWS_ENDPOINT_URL_S3,
  }), // or cloudflare(), backblaze(), tigris(), ...
  bucketName: env.S3_BUCKET_NAME,
  routes: {
    businessCover: route({
      fileTypes: ["image/*"],
      multipleFiles: false,
      onBeforeUpload: async ({ req: { body }, file, clientMetadata }) => {
        console.log({ clientMetadata });
        console.log({ body });

        return {
          objectInfo: {
            key: `business-cover/${file.name}`,
          },
        };
      },
    }),
    businessLogo: route({
      fileTypes: ["image/*"],
      multipleFiles: false,
      onBeforeUpload: async ({ req: { body }, file, clientMetadata }) => {
        console.log({ clientMetadata });
        console.log({ body });

        return {
          objectInfo: {
            key: `business-logo/${file.name}`,
          },
        };
      },
    }),
    productsImages: route({
      fileTypes: ["image/*"],
      multipleFiles: true,
      maxFileSize: 1024 * 1024 * 4, // 4MB
      onBeforeUpload: async ({
        req: { body, bodyUsed, headers },
        files,
        clientMetadata,
      }) => {
        console.log({ clientMetadata });
        console.log({ files });
        console.log({ body });
        console.log({ bodyUsed });
        console.log({ headers });
        const [error, result] = await getSession();
        if (error || !result?.session || !result?.user) {
          throw new RejectUpload("Not logged in!");
        }

        return {
          generateObjectInfo: ({ file }) => ({
            key: `products/${file.name}`,
            metadata: {
              author: result.user.id,
            },
          }),
        };
      },
    }),
  },
};

export const { POST } = toRouteHandler(router);
