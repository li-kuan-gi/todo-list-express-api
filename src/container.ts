import { config } from "./config";
import { getMongoClient } from "./mongodb-client";
import { Signup } from "./service/auth";
import { AuthRepoMongo } from "./storage/auth-repo-mongo";

export const dependencyContainer = {
    getSignupService: () => {
        const client = getMongoClient();
        const repo = new AuthRepoMongo(client.db(config.dbName));
        return new Signup(repo);
    }
};