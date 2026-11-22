import { jwt } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { MongoTopologyClosedError } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getMongo, resetMongo } from "@/lib/mongodb";

type MongoAdapterFactory = ReturnType<typeof mongodbAdapter>;
type MongoAdapter = ReturnType<MongoAdapterFactory>;
type MongoAdapterOptions = Parameters<MongoAdapterFactory>[0];

/**
 * Better Auth builds its adapter when the module is imported. On Vercel that
 * happens during build and in serverless instances with no live DB connection.
 * This factory resolves the connection on first use and rebuilds the adapter
 * if the driver reports a closed topology.
 */
const lazyMongoAdapter = (options: MongoAdapterOptions): MongoAdapter => {
  let adapterPromise: Promise<MongoAdapter> | undefined;

  const getAdapter = () => {
    adapterPromise ??= getMongo().then(({ client, db }) =>
      mongodbAdapter(db, { client })(options)
    );
    return adapterPromise;
  };

  const call = async <T>(
    run: (adapter: MongoAdapter) => Promise<T>
  ): Promise<T> => {
    try {
      return await run(await getAdapter());
    } catch (error) {
      if (
        error instanceof MongoTopologyClosedError ||
        (error as { name?: string } | null)?.name === "MongoTopologyClosedError"
      ) {
        adapterPromise = undefined;
        resetMongo();
        return run(await getAdapter());
      }
      throw error;
    }
  };

  return {
    id: "mongodb-adapter",
    create: (data: Parameters<MongoAdapter["create"]>[0]) =>
      call((adapter) => adapter.create(data)),
    findOne: (data: Parameters<MongoAdapter["findOne"]>[0]) =>
      call((adapter) => adapter.findOne(data)),
    findMany: (data: Parameters<MongoAdapter["findMany"]>[0]) =>
      call((adapter) => adapter.findMany(data)),
    count: (data: Parameters<MongoAdapter["count"]>[0]) =>
      call((adapter) => adapter.count(data)),
    update: (data: Parameters<MongoAdapter["update"]>[0]) =>
      call((adapter) => adapter.update(data)),
    updateMany: (data: Parameters<MongoAdapter["updateMany"]>[0]) =>
      call((adapter) => adapter.updateMany(data)),
    delete: (data: Parameters<MongoAdapter["delete"]>[0]) =>
      call((adapter) => adapter.delete(data)),
    deleteMany: (data: Parameters<MongoAdapter["deleteMany"]>[0]) =>
      call((adapter) => adapter.deleteMany(data)),
    consumeOne: (data: Parameters<MongoAdapter["consumeOne"]>[0]) =>
      call((adapter) => adapter.consumeOne(data)),
    incrementOne: (data: Parameters<MongoAdapter["incrementOne"]>[0]) =>
      call((adapter) => adapter.incrementOne(data)),
    transaction: <R>(callback: Parameters<MongoAdapter["transaction"]>[0]) =>
      call((adapter) => adapter.transaction(callback)),
    createSchema: (
      props: Parameters<NonNullable<MongoAdapter["createSchema"]>>[0]
    ) => call((adapter) => adapter.createSchema!(props)),
  } as unknown as MongoAdapter;
};

export const auth = betterAuth({
  database: lazyMongoAdapter,
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,

  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
      },
    }),
  ],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: ["customer", "technician", "admin"],
        required: false,
        defaultValue: "customer",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      area: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      bio: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const requestedRole = ctx?.body?.role;
          const role = requestedRole ?? "customer";

          if (role !== "customer" && role !== "technician") {
            throw new APIError("BAD_REQUEST", {
              message: "Invalid account type.",
            });
          }

          return {
            data: {
              ...user,
              role,
            },
          };
        },
      },
    },
  },
});
