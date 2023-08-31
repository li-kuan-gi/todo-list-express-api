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
            params: { id: "exist" },
            body: { account: "allowed" }
        } as unknown as Request;

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

    it("forward a WrongFormat error if the format of data is wrong.", async () => {
        delete req.params.id;
        await removeTask(req, res, next);
        expect(next).toBeCalledWith(expect.any(WrongFormat));
    });

    it("forward error if any occured.", async () => {
        req.body.account = "not allowed";
        await removeTask(req, res, next);
        expect(next).toBeCalledWith(expect.any(Error));
    });
});

describe("\"areValidType\"", () => {
    it("return true if all types are valid.", () => {
        expect(areValidType("acc", "id")).toBeTruthy();
    });

    it("return false if account is not a string.", () => {
        expect(areValidType(1, "id")).toBeFalsy();
    });

    it("return false if id is not a string.", () => {
        expect(areValidType("acc", 0)).toBeFalsy();
    });
});

class FakeRemoveTask implements IRemoveTask {
    async execute(id: string, account: string): Promise<void> {
        if (id === "not exist" || account === "not allowed") throw new Error();
    };
}