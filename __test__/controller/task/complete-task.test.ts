import { NextFunction, Request, Response } from "express";

import { CompleteTaskResult, ICompleteTask } from "@task/service";

import { getCompleteTaskController } from "@controller/task";
import { WrongFormat } from "@controller/wrong-format";

let req: Request;
let res: Response;
let next: NextFunction;
let complete: (req: Request, res: Response, next: NextFunction) => any;

beforeEach(() => {
    const beforeComplete = new Date();
    req = {
        params: { id: "exist" },
        body: { account: "acc", time: beforeComplete.toISOString() }
    } as unknown as Request;

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    } as unknown as Response;

    next = jest.fn();

    const container = { getCompleteTask: () => new FakeCompleteTask() };
    complete = getCompleteTaskController(container);
});

describe("complete task controller", () => {
    it("return status 200 if complete success.", async () => {
        await complete(req, res, next);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalled();
    });

    it("return status 422 if the complete fail", async () => {
        const now = new Date();
        const afterComplete = new Date(now.getTime() + 1000 * 1000);
        req.body.time = afterComplete.toISOString();

        await complete(req, res, next);

        expect(res.status).toBeCalledWith(422);
        expect(res.json).toBeCalled();
    });

    it("forward WrongFormat error if the format of data is wrong.", async () => {
        req.body.time = "";
        await complete(req, res, next);
        expect(next).toBeCalledWith(expect.any(WrongFormat));
    });

    it("forward error if the error occured.", async () => {
        req.body.account = "not allowed";
        await complete(req, res, next);
        expect(next).toBeCalledWith(expect.any(Error));
    });
});

class FakeCompleteTask implements ICompleteTask {
    async execute(account: string, id: string, time: Date): Promise<CompleteTaskResult> {
        if (account === "not allowed" || id === "not exist") throw new Error();

        const now = new Date();
        return time > new Date(now.getTime() + 1000 * 100)
            ? CompleteTaskResult.NotInRunning
            : CompleteTaskResult.Success;
    }
}