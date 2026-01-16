import { RejectUpload } from "@better-upload/server";
import { v4 as uuidv4 } from "uuid";
import { getCurrentSession } from "@/data/session/get-current-session";

export const UploadService = {
  async handleBusinessCoverUpload() {
    const uniqueKey = uuidv4();
    return {
      objectInfo: {
        key: `business-cover/${uniqueKey}`,
      },
    };
  },

  async handleBusinessLogoUpload() {
    const uniqueKey = uuidv4();
    return {
      objectInfo: {
        key: `business-logo/${uniqueKey}`,
      },
    };
  },

  async handleProductsImagesUpload() {
    const { user } = await getCurrentSession();

    if (!user || !user.id) {
      throw new RejectUpload("Not logged in!");
    }

    const userId = user.id;
    const uniqueKey = uuidv4();

    return {
      generateObjectInfo: () => ({
        key: `products/${uniqueKey}`,
        metadata: {
          author: userId,
        },
      }),
    };
  },
};
