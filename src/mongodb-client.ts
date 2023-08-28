import { MongoClient } from "mongodb";
import { config } from "./config";

let client: MongoClient;

export const connectMongo = async () => {
    if (!client) {
        client = await MongoClient.connect(config.mongodbUri as string);
    }
};

export const getMongoClient = (): MongoClient => {
    return client;
};