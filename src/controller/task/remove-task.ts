import { NextFunction, Request, Response } from "express";

import { IRemoveTask } from "@task/service";
import { WrongFormat } from "..";

export const getRemoveTaskController = (container: RemoveTaskContainer) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.body;
        if (typeof id !== "string") return next(new WrongFormat());
        try {
            const removeTask = container.getRemoveTask();
            await removeTask.execute(id);
            return res.status(200);
        } catch (err) {
            next(err);
        }
    };

export interface RemoveTaskContainer {
    getRemoveTask: () => IRemoveTask;
}