import { Router } from "express";
import { DependencyContainer } from "./container";
import { getAddTaskController, getRemoveTaskController } from "./controller";

export const getTaskRouter = (container: DependencyContainer) => {
    const router = Router();

    router.post("/add", getAddTaskController(container));

    router.post("/remove/:id", getRemoveTaskController(container));

    return router;
};