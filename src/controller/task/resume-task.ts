import { NextFunction, Request, Response } from "express";

import { IResumeTask, ResumeTaskResult } from "@task/service";

import { WrongFormat } from "@controller/wrong-format";
import { areValidOpParams } from "./are-valid-op-params";

export const getResumeTaskController = (container: ResumeTaskContainer) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { account } = req.body;
        const timeString = req.body.time;

        if (!areValidOpParams(account, id, timeString)) return next(new WrongFormat());
        const time = new Date(timeString);

        try {
            const resume = container.getResumeTask();
            const result = await resume.execute(account, id, time);
            return result === ResumeTaskResult.Success ? res.status(200) : res.status(422);
        } catch (error) {
            next(error);
        }
    };

export interface ResumeTaskContainer {
    getResumeTask: () => IResumeTask;
}