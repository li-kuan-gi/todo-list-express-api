import { NextFunction, Request, Response } from "express";

import { IResumeTask, ResumeTaskResult } from "@task/service";

import { getResumeTaskController } from "@controller/task";
import { WrongFormat } from "@controller/wrong-format";

let req: Request;
let res: Response;
let next: NextFunction;
let resume: (req: Request, res: Response, next: NextFunction) => any;

beforeEach(() => {
    const beforeResume = new Date();
    req = {
        params: { id: "exist" },
        body: { account: "acc", time: beforeResume.toISOString() }
    } as unknown as Request;

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    } as unknown as Response;

    next = jest.fn();

    const container = { getResumeTask: () => new FakeResumeTask() };
    resume = getResumeTaskController(container);
});

describe("resume task controller", () => {
    it("return status 200 if resume success.", async () => {
        await resume(req, res, next);
        expect(res.status).toBeCalledWith(200);
    });

    it("return status 422 if the resume fail", async () => {
        const now = new Date();
        const afterResume = new Date(now.getTime() + 1000 * 1000);
        req.body.time = afterResume.toISOString();

        await resume(req, res, next);

        expect(res.status).toBeCalledWith(422);
    });

    it("forward WrongFormat error if the format of data is wrong.", async () => {
        req.body.time = "";
        await resume(req, res, next);
        expect(next).toBeCalledWith(expect.any(WrongFormat));
    });

    it("forward error if the error occured.", async () => {
        req.body.account = "not allowed";
        await resume(req, res, next);
        expect(next).toBeCalledWith(expect.any(Error));
    });
});

class FakeResumeTask implements IResumeTask {
    async execute(account: string, id: string, time: Date): Promise<ResumeTaskResult> {
        if (account === "not allowed" || id === "not exist") throw new Error();

        const now = new Date();
        return time > new Date(now.getTime() + 1000 * 100)
            ? ResumeTaskResult.NotStopped
            : ResumeTaskResult.Success;
    }
}