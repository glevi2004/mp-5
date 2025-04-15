import { MongoClient } from "mongodb"; // MongoClient class from MongoDB Driver

// Extend the global object type in TS to include our custom _mongoClientPromise property
// avoid type errors when attaching a new property to the global obj
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Get the MongoDB connection string from the environment variables
// "!" tells TS you're sure MONGO_URI is defined
const uri = process.env.MONGO_URI!;

// optional config object for MongoClient
// (can include settings like timouts, pooling, etc)
const options = {};

// Variable to hold the MongoClient instance
let client: MongoClient;
// Variable to hold promise returned from client.connect()
let clientPromise: Promise<MongoClient>;

// Creates new MongoClient instance and connect to MongoDB
// Save the connection promise to the global objso it can be reused during hot reloads
// avoids creating a new connection everytime Next.js reloads the server
if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options); // Create the client
  global._mongoClientPromise = client.connect(); // Connect and save the promise globally
}

// Reuse existing promise if already defined
clientPromise = global._mongoClientPromise;

// Helper to connect to MongoDB and return the "mp-5 db"
// used throughout the app whenever we need to access the DB
export async function connectToDB() {
  const client = await clientPromise;
  return client.db("mp-5"); // your DB name
}
