import express, { Express, NextFunction, Request, Response } from "express";
import { Server } from "http";
import { ContainerConfig, DependencyContainer } from "./container";
import { errorController, getJwtValidateMiddleware, getLoginController, getSignupController } from "./controller";
import { getTaskRouter } from "./task-router";

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

        this.app.use("/task", getJwtValidateMiddleware(this.config.jwtSecret), getTaskRouter(this.container));

        this.app.use(errorController);

        this.app.use((err: Error, req: Request, res: Response, next: NextFunction): any => {
            res.status(500).json({});
        });
    }

    listen(port: number, cb?: () => void): Server {
        return this.app.listen(port, cb);
    }
}

export interface AppConfig extends ContainerConfig {
    jwtSecret: string;
}