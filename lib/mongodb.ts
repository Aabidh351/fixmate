import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is not configured.");
}

const globalForMongo = globalThis as typeof globalThis & {
  __fixmateMongoClientPromise?: Promise<MongoClient>;
};

function connectOnce(): Promise<MongoClient> {
  const client = new MongoClient(uri!, {
    // Vercel runs many short-lived instances. Keep each pool small so a traffic
    // spike cannot exhaust the Atlas connection limit, and fail fast if the
    // Atlas hosts are unreachable instead of holding a function open for 80s.
    maxPoolSize: 3,
    minPoolSize: 0,
    // Keep warm sockets instead of closing them after 30s. Reconnecting on
    // every lull forces a fresh TLS handshake, which is what is timing out.
    maxIdleTimeMS: 0,
    connectTimeoutMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
  });

  // Surface the per-node SDAM error in Vercel logs. The aggregate log only
  // says "ReplicaSetNoPrimary"; this shows why each Atlas node was rejected.
  client.on("serverDescriptionChanged", ({ address, newDescription }) => {
    if (newDescription.error) {
      console.error(
        `[mongo] ${address}: ${newDescription.error.name}: ${newDescription.error.message}`
      );
    }
  });

  const promise = client.connect().catch((error) => {
    // A failed connect leaves the driver topology closed, so never reuse it.
    void client.close().catch(() => {});
    throw error;
  });

  return promise;
}

/**
 * Only retry failures that happened before any command was sent, so a write
 * can never be duplicated. TLS/DNS stalls on a cold Vercel instance are
 * usually transient; the driver's `SystemOverloadedError` label is applied to
 * every socket-establishment error and is not evidence of a real overload.
 */
function isTransientConnectError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Socket 'secureConnect' timed out") ||
    message.includes("during connection establishment") ||
    message.includes("Server selection timed out")
  );
}

function connect(): Promise<MongoClient> {
  const attempt = async (): Promise<MongoClient> => {
    for (let i = 0; i < 2; i++) {
      try {
        return await connectOnce();
      } catch (error) {
        if (i === 1 || !isTransientConnectError(error)) {
          throw error;
        }
        // Small jitter so instances that cold-start together don't retry in
        // lockstep and recreate the same connection burst.
        await new Promise((resolve) =>
          setTimeout(resolve, 100 + Math.floor(Math.random() * 200))
        );
      }
    }
    throw new Error("unreachable");
  };

  const promise = attempt().catch((error) => {
    // A failed connect leaves a closed topology. If that promise is cached,
    // every later request reuses a dead client and keeps throwing
    // MongoTopologyClosedError. Drop it so the next request can retry.
    if (globalForMongo.__fixmateMongoClientPromise === promise) {
      globalForMongo.__fixmateMongoClientPromise = undefined;
    }
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
