import { t } from "elysia";

export const BusinessSetupSchema = t.Object({
  name: t.String({ minLength: 1, error: "El nombre es requerido" }),
  userEmail: t.String(),
  category: t.Optional(t.String()),
  description: t.Optional(t.String()),
  address: t.Optional(t.String()),
  phone: t.Optional(t.String()),
  website: t.Optional(t.String()),
  whatsapp: t.Optional(t.String()),
  facebook: t.Optional(t.String()),
  instagram: t.Optional(t.String()),
  logo: t.Object({
    isMainImage: t.Boolean(),
    file: t.Optional(
      t.File({
        minItems: 1,
        error: "Upload at least one file.",
      }),
    ),
    key: t.Optional(t.String()),
  }),
  coverImage: t.Object({
    isMainImage: t.Boolean(),
    file: t.Optional(
      t.File({
        minItems: 1,
        error: "Upload at least one file.",
      }),
    ),
    key: t.Optional(t.String()),
  }),
  tags: t.Optional(t.Array(t.String())),
});

export const BusinessUpdateSchema = t.Composite([
  BusinessSetupSchema,
  t.Object({
    name: t.String({ minLength: 1, error: "El nombre es requerido" }),
    email: t.String({ format: "email", error: "El email es requerido" }),
  }),
]);
