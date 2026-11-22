import { jwt } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is not configured.");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client = globalForMongo.mongoClient ?? new MongoClient(uri, { maxPoolSize: 5 });
globalForMongo.mongoClient = client; // always cache, including production

const db = client.db("fixmateDB");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client, transaction: false }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

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
