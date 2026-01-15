/** biome-ignore-all lint/suspicious/noExplicitAny: <necesary> */
import { Elysia } from "elysia";
import { auth } from "@/lib/auth";
import { AppError } from "../errors";

export const authPlugin = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    isBusiness: {
      async resolve({ request: { headers } }) {
        const { user, session, business } = await resolveAuthUser(headers);

        const isBusiness = user?.role === "BUSINESS";
        if (!isBusiness || !session || !user)
          throw new AppError("Unauthorized", "UNAUTHORIZED");

        return {
          session,
          business,
          isBusiness,
        };
      },
    },
    isAdmin: {
      async resolve({ request: { headers } }) {
        const { user, session, admin } = await resolveAuthUser(headers);

        const isAdmin = user?.role === "ADMIN";
        if (!isAdmin || !admin || !session)
          throw new AppError("Unauthorized", "UNAUTHORIZED");

        return {
          admin,
          isAdmin,
        };
      },
    },
    isUser: {
      async resolve({ request: { headers } }) {
        const { user, session } = await resolveAuthUser(headers);

        const isUser = user?.role === "USER";
        if (!isUser || !user || !session)
          throw new AppError("Unauthorized", "UNAUTHORIZED");

        return {
          user,
          isUser,
        };
      },
    },
  });

export async function getSessionFromHeaders(headers: Headers) {
  return auth.api.getSession({
    headers,
  });
}

async function resolveAuthUser(headers: Headers) {
  const session = await getSessionFromHeaders(headers);
  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
    business: session?.business ?? null,
    admin: session?.admin ?? null,
  };
}

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => {
  _schema ??= auth.api.generateOpenAPISchema();
  return _schema;
};

export const OpenAPI = {
  getPaths: (prefix = "/auth/api") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as any)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
