import { Router } from "express";
import { DependencyContainer } from "./container";
import { getAddTaskController } from "./controller";

export const getTaskRouter = (container: DependencyContainer) => {
    const router = Router();
    router.post("/add", getAddTaskController(container));

    return router;
};