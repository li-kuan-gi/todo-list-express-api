import { NextFunction, Request, Response } from "express";

import { IStartTask, StartTaskResult } from "@task/service";

import { getStartTaskController } from "@controller/task";
import { WrongFormat } from "@controller/wrong-format";

describe("start task controller", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let start: (req: Request, res: Response, next: NextFunction) => any;

    beforeEach(() => {
        req = {
            params: { id: "exist" },
            body: {
                account: "allowed",
                time: new Date().toISOString()
            }
        } as unknown as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as unknown as Response;

        next = jest.fn();

        const container = { getStartTask: () => new FakeStartTask() };
        start = getStartTaskController(container);
    });

    it("return status 200 if the start success.", async () => {
        await start(req, res, next);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalled();
    });

    it("return status 422 if the task has started.", async () => {
        const now = new Date();
        req.body.time = new Date(now.getTime() + 1000 * 1000).toISOString();
        await start(req, res, next);
        expect(res.status).toBeCalledWith(422);
        expect(res.json).toBeCalled();
    });

    it("forward WrongFormat error if the format of data is wrong.", async () => {
        req.body.time = "...";
        await start(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(WrongFormat));
    });

    it("forward error if the error occured.", async () => {
        req.body.account = "not allowed";
        await start(req, res, next);
        expect(next).toBeCalledWith(expect.any(Error));
    });
});

class FakeStartTask implements IStartTask {
    async execute(account: string, id: string, time: Date): Promise<StartTaskResult> {
        if (account === "not allowed" || id === "not exist") throw new Error();
        const now = new Date();
        return time > new Date(now.getTime() + 1000 * 100)
            ? StartTaskResult.HasStarted
            : StartTaskResult.Success;
    }
}