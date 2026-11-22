import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is not configured.");
}

const globalForMongo = globalThis as typeof globalThis & {
  __fixmateMongoClientPromise?: Promise<MongoClient>;
};

function connect(): Promise<MongoClient> {
  const client = new MongoClient(uri!, {
    // Vercel runs many short-lived instances. Keep each pool small so a traffic
    // spike cannot exhaust the Atlas connection limit, and fail fast if the
    // Atlas hosts are unreachable instead of holding a function open for 80s.
    maxPoolSize: 3,
    minPoolSize: 0,
    maxIdleTimeMS: 30_000,
    connectTimeoutMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
  });

  const promise = client.connect().catch((error) => {
    // A failed connect leaves the driver topology closed. If that promise is
    // cached, every later request reuses a dead client and keeps throwing
    // MongoTopologyClosedError. Drop it so the next request can retry.
    if (globalForMongo.__fixmateMongoClientPromise === promise) {
      globalForMongo.__fixmateMongoClientPromise = undefined;
    }
    void client.close().catch(() => {});
    throw error;
  });

  return promise;
}

export function getMongo(): Promise<{ client: MongoClient; db: Db }> {
  globalForMongo.__fixmateMongoClientPromise ??= connect();

  return globalForMongo.__fixmateMongoClientPromise.then((client) => ({
    client,
    db: client.db("fixmateDB"),
  }));
}

export function resetMongo(): void {
  const promise = globalForMongo.__fixmateMongoClientPromise;
  globalForMongo.__fixmateMongoClientPromise = undefined;

  if (promise) {
    void promise
      .then((client) => client.close().catch(() => {}))
      .catch(() => {});
  }
}
