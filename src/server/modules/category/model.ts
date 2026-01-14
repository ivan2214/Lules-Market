import { t } from "elysia";
import { models } from "@/db/model";

export namespace CategoryModel {
  export const listAllOutput = t.Array(t.Object(models.select.category));
}
