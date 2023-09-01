import { NextFunction, Request, Response } from "express";

import { ChangeExpectDurationResult, IChangeExpectDuration } from "@task/service";

import { WrongFormat } from "@controller/wrong-format";

export const getChangeExpectDurationController = (container: ChangeExpectDurationContainer) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { account, duration } = req.body;

        if (!areValidType(id, account, duration)) return next(new WrongFormat());

        try {
            const change = container.getChangeExpectDuration();
            const result = await change.execute(account, id, duration);
            if (result === ChangeExpectDurationResult.Success) {
                return res.status(200).json({});
            } else {
                return res.status(422).json({});
            }
        } catch (error) {
            return next(error);
        }
    };

export function areValidType(id: any, account: any, duration: any): boolean {
    return (typeof id === "string")
        && (typeof account === "string")
        && (typeof duration === "number");
}

export interface ChangeExpectDurationContainer {
    getChangeExpectDuration(): IChangeExpectDuration;
}