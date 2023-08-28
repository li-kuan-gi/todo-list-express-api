import { config } from "./config";
import { getMongoClient } from "./mongodb-client";
import { Signup, ValidateLogin } from "./service/auth";
import { AuthRepoMongo } from "./storage/auth-repo-mongo";
import { AuthViewMongo } from "./storage/auth-view-mongo";

export const container = {
    getSignupService: () => {
        const client = getMongoClient();
        const repo = new AuthRepoMongo(client.db(config.dbName));
        return new Signup(repo);
    },
    getValidateLoginService: () => {
        const client = getMongoClient();
        const view = new AuthViewMongo(client.db(config.dbName));
        return new ValidateLogin(view);
    }
};