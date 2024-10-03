import { MongoClient } from "mongodb";
import cosmosConfig from "../config/cosmos.js";

let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(cosmosConfig.URI);

    await client.connect();

    db = client.db(cosmosConfig.dbName);

    console.log("Conexión a MongoDB/Cosmos DB establecida correctamente");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error(
      "No se ha establecido una conexión a la base de datos. Llama a connectToDatabase primero."
    );
  }
  return db;
}

export { connectToDatabase, getDb };
