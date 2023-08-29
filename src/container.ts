import { ISignup, IValidateLogin, Signup, ValidateLogin } from "./service/auth";
import { AuthRepoMongo } from "./storage/auth/auth-repo-mongo";
import { AuthViewMongo } from "./storage/auth/auth-view-mongo";
import { MongoClientManager } from "./storage/mongo-client-manager";

export class DependencyContainer {
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

export interface ContainerConfig {
    mongodbUri: string;
    dbName: string;
    userCollName: string;
    taskCollName: string;
}