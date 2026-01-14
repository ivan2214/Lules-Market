import { t } from "elysia";
import { models } from "@/db/model";

export namespace PlanModel {
  export const listAllOutput = t.Array(t.Object(models.select.plan));
}
