import { MongoClient } from "mongodb";

export class MongoClientManager {
    private client?: MongoClient;
    private uri: string;

    constructor(uri: string) {
        this.uri = uri;
    }

    async connect() {
        if (!this.client) {
            this.client = await MongoClient.connect(this.uri);
        }
    }

    getMongoClient(): MongoClient {
        if (!this.client) throw new Error("should first use connect method");
        return this.client;
    };
}