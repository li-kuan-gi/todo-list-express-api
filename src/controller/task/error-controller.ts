import { TaskNotFound } from "@task/storage";
import { Request, Response, NextFunction } from "express";
import { WrongFormat } from "../wrong-format";
import { TimeReverse } from "@task/domain";
import { NotAllowed } from "@task/service";

export const errorController = (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof WrongFormat) {
        return res.status(422).json({
            msg: "the format of data is wrong."
        });
    } else if (err instanceof TaskNotFound) {
        return res.status(400).json({
            msg: "the task is not found."
        });
    } else if (err instanceof TimeReverse) {
        return res.status(400).json({
            msg: "the time in data reverses."
        });
    } else if (err instanceof NotAllowed) {
        return res.status(403).json({
            msg: "the account is not allowed to operate the task."
        });
    } else {
        next(err);
    }
};