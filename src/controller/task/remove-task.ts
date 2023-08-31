import { NextFunction, Request, Response } from "express";

import { IRemoveTask } from "@task/service";
import { WrongFormat } from "..";

export const getRemoveTaskController = (container: RemoveTaskContainer) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { id, account } = req.body;
        if (!areValidType(id, account)) return next(new WrongFormat());

        try {
            const removeTask = container.getRemoveTask();
            await removeTask.execute(id, account);
            return res.status(200);
        } catch (err) {
            next(err);
        }
    };

export interface RemoveTaskContainer {
    getRemoveTask: () => IRemoveTask;
}

export function areValidType(id: any, account: any): boolean {
    return (typeof id === "string") && (typeof account === "string");
}