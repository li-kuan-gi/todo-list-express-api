import { Router } from "express";
import { DependencyContainer } from "./container";
import { getAddTaskController, getChangeExpectDurationController, getCompleteTaskController, getRemoveTaskController, getResumeTaskController, getStartTaskController, getStopTaskController } from "./controller";

export const getTaskRouter = (container: DependencyContainer) => {
    const router = Router();

    router.post("/add", getAddTaskController(container));

    router.post("/remove/:id", getRemoveTaskController(container));

    router.post("/change-duration/:id", getChangeExpectDurationController(container));

    router.post("/start/:id", getStartTaskController(container));

    router.post("/stop/:id", getStopTaskController(container));

    router.post("/resume/:id", getResumeTaskController(container));

    router.post("/complete/:id", getCompleteTaskController(container));

    return router;
};