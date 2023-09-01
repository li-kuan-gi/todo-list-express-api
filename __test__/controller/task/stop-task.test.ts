import { getStopTaskController } from "@controller/task";
import { WrongFormat } from "@controller/wrong-format";
import { IStopTask, StopTaskResult } from "@task/service";
import { NextFunction, Request, Response } from "express";

let req: Request;
let res: Response;
let next: NextFunction;
let stop: (req: Request, res: Response, next: NextFunction) => any;

beforeEach(() => {
    const beforeStop = new Date()
    req = {
        params: { id: "exist" },
        body: { account: "acc", time: beforeStop.toISOString() }
    } as unknown as Request;

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    } as unknown as Response;

    next = jest.fn();

    const container = { getStopTask: () => new FakeStopTask() };
    stop = getStopTaskController(container);
});

describe("stop task controller", () => {
    it("return status 200 if stop success.", async () => {
        await stop(req, res, next);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalled();
    });

    it("return status 422 if the stop fail", async () => {
        const now = new Date();
        const afterStop = new Date(now.getTime() + 1000 * 1000);
        req.body.time = afterStop.toISOString();

        await stop(req, res, next);

        expect(res.status).toBeCalledWith(422);
        expect(res.json).toBeCalled();
    });

    it("forward WrongFormat error if the format of data is wrong.", async () => {
        req.body.time = "";
        await stop(req, res, next);
        expect(next).toBeCalledWith(expect.any(WrongFormat));
    });

    it("forward error if the error occured.", async () => {
        req.body.account = "not allowed";
        await stop(req, res, next);
        expect(next).toBeCalledWith(expect.any(Error));
    });
});

class FakeStopTask implements IStopTask {
    async execute(account: string, id: string, time: Date): Promise<StopTaskResult> {
        if (account === "not allowed" || id === "not exist") throw new Error();

        const now = new Date();
        return time > new Date(now.getTime() + 1000 * 100)
            ? StopTaskResult.NotInRunning
            : StopTaskResult.Success;
    }
}