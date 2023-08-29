import { Collection, Db } from "mongodb";
import { AuthView } from "../../service/auth";

export class AuthViewMongo implements AuthView {
    private readonly collection: Collection;

    constructor(db: Db, userCollName: string) {
        this.collection = db.collection(userCollName);
    }

    async getPassword(account: string): Promise<string | undefined> {
        const user = await this.collection.findOne(
            { account },
            { projection: { _id: 0, password: 1 } }
        );

        if (!user) {
            return undefined;
        }

        return user.password as string;
    }
}