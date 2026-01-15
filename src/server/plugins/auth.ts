/** biome-ignore-all lint/suspicious/noExplicitAny: <necesary> */
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { db } from "@/db";
import { business as businessSchema } from "@/db/schema";
import { auth } from "@/lib/auth";
import { AppError } from "../errors";

export const authPlugin = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const { user, session } = await resolveAuthUser(headers);

        if (!session || !user) return status(401);

        return {
          user,
          session,
        };
      },
    },
    // ahora segun el role
    isBusiness: {
      async resolve({ status, request: { headers } }) {
        const { user, session } = await resolveAuthUser(headers);

        if (!session) return status(401);

        const isBusiness = user?.role === "BUSINESS";
        if (!isBusiness) throw new AppError("Unauthorized", "UNAUTHORIZED");

        return {
          user,
          session,
          isBusiness,
        };
      },
    },
    isAdmin: {
      async resolve({ status, request: { headers } }) {
        const { user, session } = await resolveAuthUser(headers);

        if (!session) return status(401);

        const isAdmin = user?.role === "ADMIN";
        if (!isAdmin) throw new AppError("Unauthorized", "UNAUTHORIZED");

        return {
          user,
          session,
          isAdmin,
        };
      },
    },
    isUser: {
      async resolve({ status, request: { headers } }) {
        const { user, session } = await resolveAuthUser(headers);

        if (!session) return status(401);

        const isUser = user?.role === "USER";
        if (!isUser) throw new AppError("Unauthorized", "UNAUTHORIZED");

        return {
          user,
          session,
          isUser,
        };
      },
    },
    currentBusiness: {
      async resolve({ status, request: { headers } }) {
        const { user, session } = await resolveAuthUser(headers);

        if (!session || !user) return status(401);

        const business = await db.query.business.findFirst({
          where: eq(businessSchema.userId, user.id),
          with: {
            logo: true,
            coverImage: true,
            category: true,
            currentPlan: {
              with: {
                plan: true,
              },
            },
            products: true,
            user: true,
          },
        });

        if (!business) throw new AppError("Unauthorized", "UNAUTHORIZED");

        return {
          user,
          session,
          currentBusiness: business,
        };
      },
    },
  });

export async function getSessionFromHeaders(
  headers: Headers | Record<string, string>,
) {
  const headersObj =
    headers instanceof Headers
      ? headers
      : new Headers(headers as Record<string, string>);

  return auth.api.getSession({
    headers: headersObj,
  });
}

async function resolveAuthUser(headers: Headers) {
  const session = await getSessionFromHeaders(headers);
  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
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
