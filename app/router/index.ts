import { adminRoute } from "./admin";
import { analyticsRoute } from "./analytics";
import { businessRoute } from "./business";
import { businessPrivateRoute } from "./business.private";
import { categoryRoute } from "./category";
import { paymentRoute } from "./payment";
import { productsRoute } from "./products";
import { productsPrivateRoute } from "./products.private";
import { settingsRoute } from "./settings";

export const router = {
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
