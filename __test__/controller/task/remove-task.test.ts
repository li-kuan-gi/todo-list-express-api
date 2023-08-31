import { NextFunction, Request, Response } from "express";

import { IRemoveTask } from "@task/service";

import { WrongFormat } from "@controller/wrong-format";
import { RemoveTaskContainer, getRemoveTaskController } from "@controller/task";
import { areValidType } from "@controller/task/remove-task";

describe("remove task controller", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let removeTask: (req: Request, res: Response, next: NextFunction) => any;

    beforeEach(() => {
        req = {
            body: { id: "exist", account: "allowed" }
        } as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as unknown as Response;

        next = jest.fn();

        const container: RemoveTaskContainer = { getRemoveTask: () => new FakeRemoveTask() };
        removeTask = getRemoveTaskController(container);
    });

    it("return status 200 if the account is allowed to remove the task.", async () => {
        await removeTask(req, res, next);

        expect(res.status).toBeCalledWith(200);
    });

    it("forward a WrongFormat error if the format of request is invalid.", async () => {
        req.body.id = 0;
        await removeTask(req, res, next);
        expect(next).toBeCalledWith(expect.any(WrongFormat));
    });

    it("forward error if any occured.", async () => {
        req.body.id = "not exist";
        await removeTask(req, res, next);
        expect(next).toBeCalledWith(expect.any(Error));
    });
});

describe("\"areValidType\" function", () => {
    it("return true if all types are valid.", () => {
        expect(areValidType("id", "account")).toBeTruthy();
    });

    it("return false if id is not a string.", () => {
        expect(areValidType(0, "account")).toBeFalsy();
    });

    it("return false if account is not a string.", () => {
        expect(areValidType(0, "account")).toBeFalsy();
    });
});

class FakeRemoveTask implements IRemoveTask {
    async execute(id: string, account: string): Promise<void> {
        if (id === "not exist" || account === "not allowed") throw new Error();
    };
}