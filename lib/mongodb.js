import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient;

export async function connectToDatabase() {
  // check the cached.
  if (cachedClient) {
    // load from cache
    return {
      client: cachedClient,
    };
  }

  // set the connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // check the MongoDB URI
  if (!MONGODB_URI) {
    throw new Error("Define the MONGODB_URI environmental variable");
  }
  
  // Connect to cluster
  let client = new MongoClient(MONGODB_URI);
  await client.connect();
  
  // set cache
  cachedClient = client;

  return {
    client: cachedClient,
  };
}