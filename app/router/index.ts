import { adminRoute } from "./admin";
import { analyticsRoute } from "./analytics";
import { businessRoute } from "./business";
import { businessPrivateRoute } from "./business.private";
import { categoryRoute } from "./category";
import { paymentRoute } from "./payment";
import { planRoute } from "./plan";
import { productsRoute } from "./products";
import { productsPrivateRoute } from "./products.private";
import { settingsRoute } from "./settings";
import { userRoute } from "./user";

export const router = {
  user: userRoute,
  plan: planRoute,
  category: categoryRoute,
  admin: adminRoute,
  products: {
    ...productsRoute,
    // Private
    ...productsPrivateRoute,
  },
  business: {
    // Public
    ...businessRoute,
    // Private
    ...businessPrivateRoute,
  },
  analytics: analyticsRoute,
  payment: paymentRoute,
  settings: settingsRoute,
};
