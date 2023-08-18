import { Db } from "mongodb";
import { AuthView } from "../service/auth";
import { config } from "../config";

export class AuthViewMongo implements AuthView {
    private readonly db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getPassword(account: string): Promise<string | undefined> {
        const user = await this.db.collection(config.userCollName).findOne({ account });

        if (!user) {
            return undefined;
        }

        return user.password as string;
    }
}