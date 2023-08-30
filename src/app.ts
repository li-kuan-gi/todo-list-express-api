import express, { Express } from "express";
import { Server } from "http";
import { ContainerConfig, DependencyContainer } from "./container";
import { getLoginController, getSignupController } from "./controller";

export class App {
    private readonly config: AppConfig;
    private container: DependencyContainer;
    private app: Express;

    constructor(config: AppConfig) {
        this.config = config;
        this.container = new DependencyContainer(config);
        this.app = express();
    }

    async setup() {
        await this.container.setup();

        this.app.use(express.json());

        this.app.post("/signup", getSignupController(this.container));

        this.app.post("/login", getLoginController(this.container, this.config.jwtSecret));
    }

    listen(port: number, cb?: () => void): Server {
        return this.app.listen(port, cb);
    }
}

export interface AppConfig extends ContainerConfig {
    jwtSecret: string;
}