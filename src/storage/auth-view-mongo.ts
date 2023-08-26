import { Db } from "mongodb";
import { AuthView } from "../service/auth";
import { config } from "../config";

export class AuthViewMongo implements AuthView {
    private readonly db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getPassword(account: string): Promise<string | undefined> {
        const user = await this.db.collection(config.userCollName).findOne(
            { account },
            { projection: { _id: 0, password: 1 } }
        );

        if (!user) {
            return undefined;
        }

        return user.password as string;
    }
}