import { RejectUpload, type Router, route } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { v4 as uuidv4 } from "uuid";
import { getCurrentSession } from "@/data/session/get-current-session";
import { env } from "@/env/server";
import { s3 } from "@/lib/s3";

const router: Router = {
  client: s3, // or cloudflare(), backblaze(), tigris(), ...
  bucketName: env.S3_BUCKET_NAME,
  routes: {
    businessCover: route({
      fileTypes: ["image/*"],
      multipleFiles: false,
      onBeforeUpload: async () => {
        const uniqueKey = uuidv4();
        return {
          objectInfo: {
            key: `business-cover/${uniqueKey}`,
          },
        };
      },
    }),
    businessLogo: route({
      fileTypes: ["image/*"],
      multipleFiles: false,
      onBeforeUpload: async () => {
        const uniqueKey = uuidv4();
        return {
          objectInfo: {
            key: `business-logo/${uniqueKey}`,
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
        console.log({ headers });
        const { session } = await getCurrentSession();
        if (!session?.user) {
          throw new RejectUpload("Not logged in!");
        }

        const result = session;

        const uniqueKey = uuidv4();

        return {
          generateObjectInfo: () => ({
            key: `products/${uniqueKey} `,
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
