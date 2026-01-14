import { t } from "elysia";

export namespace SettingsModel {
  export const updateAccountBody = t.Object({
    name: t.String({ minLength: 1 }),
  });
}
