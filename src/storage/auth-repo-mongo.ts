import { Db, MongoServerError } from "mongodb";
import { AuthRepository } from "../service/auth";
import { config } from "../config";

export class AuthRepoMongo implements AuthRepository {
    private readonly db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async addUser(account: string, password: string): Promise<boolean> {
        try {
            await this.db.collection(config.userCollName).insertOne({ account, password });
            return true;
        } catch (e) {
            if (e instanceof MongoServerError && e.message.includes("duplicate")) {
                return false;
            } else {
                throw e;
            }
        }
    }
}