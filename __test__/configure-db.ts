import { MongoClient } from "mongodb";
import { ContainerConfig } from "@src/container";

export async function configureDB(client: MongoClient, config: ContainerConfig) {
    const db = client.db(config.dbName);
    await db.dropDatabase();
    await db.collection(config.userCollName).createIndex({ account: 1 }, { unique: true });
}