import { NextFunction, Request, Response } from "express";

import { IStopTask, StopTaskResult } from "@task/service";

import { WrongFormat } from "@controller/wrong-format";
import { areValidOpParams } from "./are-valid-op-params";

export const getStopTaskController = (container: StopTaskContainer) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { account } = req.body;
        const timeString = req.body.time;

        if (!areValidOpParams(account, id, timeString)) return next(new WrongFormat());
        const time = new Date(timeString);

        try {
            const stop = container.getStopTask();
            const result = await stop.execute(account, id, time);
            return result === StopTaskResult.Success ? res.status(200) : res.status(422);
        } catch (error) {
            next(error);
        }
    };

export interface StopTaskContainer {
    getStopTask: () => IStopTask;
}