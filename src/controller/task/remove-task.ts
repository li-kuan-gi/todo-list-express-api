import { NextFunction, Request, Response } from "express";

import { IRemoveTask } from "@task/service";

import { WrongFormat } from "@controller/wrong-format";

export const getRemoveTaskController = (container: RemoveTaskContainer) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { account } = req.body;
        if (!areValidType(account, id)) return next(new WrongFormat());

        try {
            const removeTask = container.getRemoveTask();
            await removeTask.execute(id, account);
            return res.status(200).json();
        } catch (err) {
            next(err);
        }
    };

export function areValidType(account: any, id: any): boolean {
    return (typeof account === "string") && (typeof id === "string");
}

export interface RemoveTaskContainer {
    getRemoveTask: () => IRemoveTask;
}