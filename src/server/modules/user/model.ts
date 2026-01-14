import { t } from "elysia";
import { models } from "@/db/model";

export namespace UserModel {
  export const userIdParams = t.Object({
    userId: t.String(),
  });

  export const emailQuery = t.Object({
    email: t.String(),
  });

  export const idParams = t.Object({
    id: t.String(),
  });

  export const syncRoleBody = t.Object({
    id: t.String(),
    email: t.String(),
  });

  export const publicProfileOutput = t.Nullable(
    t.Object(models.relations.profileWithRelations),
  );
  export const userOutput = t.Nullable(t.Object(models.select.user));
}
