import { MongoClient } from "mongodb";
import { config } from "./config";

let client: MongoClient;

export const getMongoClient = async (): Promise<MongoClient> => {
    if (!client) {
        client = await MongoClient.connect(config.mongodbUri as string);
    }

    return client;
};