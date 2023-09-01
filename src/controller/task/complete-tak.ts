import { NextFunction, Request, Response } from "express";

import { CompleteTaskResult, ICompleteTask, IResumeTask, ResumeTaskResult } from "@task/service";

import { WrongFormat } from "@controller/wrong-format";
import { areValidOpParams } from "./are-valid-op-params";

export const getCompleteTaskController = (container: CompleteTaskContainer) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { account } = req.body;
        const timeString = req.body.time;

        if (!areValidOpParams(account, id, timeString)) return next(new WrongFormat());
        const time = new Date(timeString);

        try {
            const complete = container.getCompleteTask();
            const result = await complete.execute(account, id, time);
            return result === CompleteTaskResult.Success ? res.status(200).json({}) : res.status(422).json({});
        } catch (error) {
            next(error);
        }
    };

export interface CompleteTaskContainer {
    getCompleteTask: () => ICompleteTask;
}