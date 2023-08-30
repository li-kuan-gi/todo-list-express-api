import { NextFunction, Request, Response } from "express";

import { AddTaskFailure, IAddTask } from "@task/service";
import { WrongFormat } from "..";

export const getAddTaskController = (container: AddTaskContainer) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { account, project, goal, expectDuration } = req.body;

        if (!areValidType(account, project, goal, expectDuration)) {
            return next(new WrongFormat());
        }

        try {
            const addTask = container.getAddTask();
            const result = await addTask.execute(account, project, goal, expectDuration);

            if (result === AddTaskFailure.InvalidExpectDuration) {
                return res.status(422).json({
                    msg: "the expect duration is invalid"
                });
            } else if (result === AddTaskFailure.Duplicated) {
                return res.status(409).json({
                    msg: "there has been a same task"
                });
            } else {
                const id = result;
                return res.status(200).json({ id });
            }
        } catch (err) {
            next(err);
        }
    };

export interface AddTaskContainer {
    getAddTask: () => IAddTask;
}

export function areValidType(account: any, project: any, goal: any, expectDuration: any): boolean {
    return (typeof account === "string")
        && (typeof project === "string")
        && (typeof goal === "string")
        && (typeof expectDuration === "number");
}