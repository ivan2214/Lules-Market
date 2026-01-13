import { RejectUpload } from "@better-upload/server";
import { v4 as uuidv4 } from "uuid";
import { getCurrentSession } from "@/data/session/get-current-session";

export const UploadService = {
  handleBusinessCoverUpload() {
    const uniqueKey = uuidv4();
    return {
      objectInfo: {
        key: `business-cover/${uniqueKey}`,
      },
    };
  },

  handleBusinessLogoUpload() {
    const uniqueKey = uuidv4();
    return {
      objectInfo: {
        key: `business-logo/${uniqueKey}`,
      },
    };
  },

  async handleProductsImagesUpload() {
    const { session } = await getCurrentSession();

    if (!session || !session?.user || !session.user.id) {
      throw new RejectUpload("Not logged in!");
    }

    const userId = session.user.id;
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
