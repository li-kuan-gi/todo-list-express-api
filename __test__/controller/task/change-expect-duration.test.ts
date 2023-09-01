import { NextFunction, Request, Response } from "express";

import { ChangeExpectDurationResult, IChangeExpectDuration } from "@task/service";

import { WrongFormat } from "@controller/wrong-format";
import { areValidType, getChangeExpectDurationController } from "@controller/task/change-expect-duration";

describe("change expect duration controller", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let change: (req: Request, res: Response, next: NextFunction) => any;

    beforeEach(() => {
        req = {
            params: { id: "exist" },
            body: {
                account: "allowed",
                duration: 1
            }
        } as unknown as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as unknown as Response;

        next = jest.fn();

        const container = { getChangeExpectDuration: () => new FakeChangeExpectDuration() };
        change = getChangeExpectDurationController(container);
    });

    it("return 200 if the change success.", async () => {
        await change(req, res, next);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalled();
    });

    it("return status 422 if the duration is invalid.", async () => {
        req.body.duration = 0;
        await change(req, res, next);
        expect(res.status).toBeCalledWith(422);
        expect(res.json).toBeCalled();
    });

    it("forward WrongFormat error if the format of data is wrong.", async () => {
        delete req.params.id;
        await change(req, res, next);
        expect(next).toBeCalledWith(expect.any(WrongFormat));
    });

    it("forward error if the error occured.", async () => {
        req.body.account = "not allowed";
        await change(req, res, next);
        expect(next).toBeCalledWith(expect.any(Error));
    });
});

describe("\"areValidType\"", () => {
    it("return true if all types are valid.", () => {
        expect(areValidType("id", "acc", 0)).toBeTruthy();
    });

    it("return false if id not a string.", () => {
        expect(areValidType(1, "acc", 0)).toBeFalsy();
    });

    it("return false if account not a string.", () => {
        expect(areValidType("id", 1, 0)).toBeFalsy();
    });

    it("return false if duration not a number.", () => {
        expect(areValidType("id", "acc", "1")).toBeFalsy();
    });
});

class FakeChangeExpectDuration implements IChangeExpectDuration {
    async execute(account: string, id: string, duration: number): Promise<ChangeExpectDurationResult> {
        if (account === "not allowed" || id === "not exist") throw new Error();

        return duration > 0 ? ChangeExpectDurationResult.Success : ChangeExpectDurationResult.InvalidDuration;
    }
}