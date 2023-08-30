import { ISignup, IValidateLogin, Signup, ValidateLogin } from "@auth/service";
import { AuthRepoMongo, AuthViewMongo } from "@auth/storage";

import { SignupContainer, ValidateLoginContainer } from "@controller/auth";

import { MongoClientManager } from "./mongo-client-manager";
import { ContainerConfig } from "./container-config";

export class DependencyContainer implements
    ValidateLoginContainer, SignupContainer {

    private manager: MongoClientManager;
    private config: ContainerConfig;

    constructor(config: ContainerConfig) {
        this.config = config;
        this.manager = new MongoClientManager(config.mongodbUri);
    }

    async setup() {
        await this.manager.connect();
    }

    getSignupService(): ISignup {
        const db = this.manager.getMongoClient().db(this.config.dbName);
        const repo = new AuthRepoMongo(db, this.config.userCollName);
        return new Signup(repo);
    }

    getValidateLoginService(): IValidateLogin {
        const db = this.manager.getMongoClient().db(this.config.dbName);
        const view = new AuthViewMongo(db, this.config.userCollName);
        return new ValidateLogin(view);
    }
}