import type { SubArray } from "better-auth/plugins/access";
import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

export type Role = keyof typeof allRoles;

export type Permissions = {
  [k in keyof typeof statement]?: SubArray<(typeof statement)[k]>;
};

// Define tus recursos y permisos
export const statement = {
  // Permisos para productos
  product: ["create", "read", "update", "delete"],
  // Incluye los permisos por defecto de Better Auth (user, session)
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

// ROL ADMIN: Tiene control total sobre todo
const adminRole = ac.newRole({
  product: ["create", "read", "update", "delete"],
  // Incluye todos los permisos de administración de usuarios/sesiones
  ...adminAc.statements,
});

// ROL USER (usuario normal): Solo puede leer productos
const userRole = ac.newRole({
  product: ["read"],
  // Incluye permisos básicos de usuario
  ...userAc.statements,
});

// ROL COMERCIO: Puede hacer CRUD de productos (se validará el plan activo en el middleware/guards)
const comercioRole = ac.newRole({
  product: ["create", "read", "update", "delete"],
  // Permisos básicos de usuario para su propia cuenta
  ...userAc.statements,
});

export const allRoles = {
  admin: adminRole,
  user: userRole,
  business: comercioRole,
} as const;

export const rolesData = Object.keys(allRoles) as Array<Role>;

export type rolesEnumData = (typeof rolesData)[number];
