import { NextFunction, Request, Response } from "express";

import { AddTaskFailure, IAddTask } from "@task/service";

import { getAddTaskController } from "@controller/task";
import { areValidType } from "@controller/task/add-task";
import { WrongFormat } from "@controller/wrong-format";


let req: Request;
let res: Response;
let next: NextFunction;
let addTask: (req: Request, res: Response, next: NextFunction) => any;

beforeEach(() => {
    req = {
        body: {
            account: "exist",
            project: "exist or not",
            goal: "not exist",
            expectDuration: 1,
            time: (new Date()).toISOString()
        }
    } as Request;

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    } as unknown as Response;

    next = jest.fn();

    const container = { getAddTask: () => new FakeAddTask() };
    addTask = getAddTaskController(container);
});

describe("add task controller", () => {
    it("return status 200 with id of the added task.", async () => {
        await addTask(req, res, next);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(expect.objectContaining({
            id: expect.any(String)
        }));
    });

    it("return status 409 if the same task has existed.", async () => {
        req.body.goal = "exist";

        await addTask(req, res, next);

        expect(res.status).toBeCalledWith(409);
        expect(res.json).toBeCalledWith(expect.objectContaining({
            msg: expect.any(String)
        }));
    });

    it("return status 422 if the expect duration is invalid.", async () => {
        req.body.expectDuration = 0;

        await addTask(req, res, next);

        expect(res.status).toBeCalledWith(422);
        expect(res.json).toBeCalledWith(expect.objectContaining({
            msg: expect.any(String)
        }));
    });

    it("forward a WrongFormat error if the format is wrong.", async () => {
        req.body.expectDuration = "1";

        await addTask(req, res, next);

        expect(next).toBeCalledWith(expect.any(WrongFormat));
    });
});

describe("\"areValidType\" function", () => {
    let account: any;
    let project: any;
    let goal: any;
    let expectDuration: any;

    beforeEach(() => {
        account = "acc";
        project = "pro";
        goal = "goal";
        expectDuration = 0;
    });

    it("return true if all types are valid.", () => {
        expect(areValidType(account, project, goal, expectDuration)).toBeTruthy();
    });

    it("return false if type of account is not string.", () => {
        account = 0;
        expect(areValidType(account, project, goal, expectDuration)).toBeFalsy();
    });

    it("return false if type of project is not string.", () => {
        project = 0;
        expect(areValidType(account, project, goal, expectDuration)).toBeFalsy();
    });

    it("return false if type of goal is not string.", () => {
        goal = 0;
        expect(areValidType(account, project, goal, expectDuration)).toBeFalsy();
    });

    it("return false if type of expectDration is not number.", () => {
        expectDuration = "1";
        expect(areValidType(account, project, goal, expectDuration)).toBeFalsy();
    });
});

class FakeAddTask implements IAddTask {
    async execute(
        _account: string,
        _project: string,
        goal: string,
        duration: number
    ): Promise<string | AddTaskFailure> {
        if (duration <= 0) return AddTaskFailure.InvalidExpectDuration;
        return goal === "exist" ? AddTaskFailure.Duplicated : "id";
    };
}