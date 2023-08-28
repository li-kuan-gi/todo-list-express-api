import { Collection, Db, MongoServerError } from "mongodb";
import { AuthRepository } from "../service/auth";

export class AuthRepoMongo implements AuthRepository {
    private readonly collection: Collection;

    constructor(db: Db, userCollName: string) {
        this.collection = db.collection(userCollName);
    }

    async addUser(account: string, password: string): Promise<boolean> {
        try {
            await this.collection.insertOne({ account, password });
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