import { NextFunction, Request, Response } from "express";

import { IStartTask, StartTaskResult } from "@task/service";

import { WrongFormat } from "@controller/wrong-format";
import { areValidOpParams } from "./are-valid-op-params";

export const getStartTaskController = (container: StartTaskContainer) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { account } = req.body;
        const timeString = req.body.time;

        if (!areValidOpParams(account, id, timeString)) return next(new WrongFormat());

        const time = new Date(timeString);
        const start = container.getStartTask();
        try {
            const result = await start.execute(account, id, time);
            return result === StartTaskResult.Success ? res.status(200).json({}) : res.status(422).json({});
        } catch (error) {
            next(error);
        }
    };

export interface StartTaskContainer {
    getStartTask: () => IStartTask;
}