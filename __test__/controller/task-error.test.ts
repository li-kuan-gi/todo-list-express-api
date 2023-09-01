import { errorController } from "@controller/task/error-controller";
import { WrongFormat } from "@controller/wrong-format";
import { TimeReverse } from "@task/domain";
import { NotAllowed } from "@task/service";
import { TaskNotFound } from "@task/storage";
import { NextFunction, Request, Response } from "express";

let err: Error;
let req: Request;
let res: Response;
let next: NextFunction;
let controller: (err: Error, req: Request, res: Response, next: NextFunction) => any;

beforeEach(() => {
    req = {} as Request;
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    } as unknown as Response;
    next = jest.fn();
    controller = errorController;
});

describe("error controller", () => {
    it("return status 422 if the format of data is wrong.", () => {
        err = new WrongFormat();
        controller(err, req, res, next);
        expect(res.status).toBeCalledWith(422);
        expect(res.json).toBeCalledWith(expect.objectContaining({
            msg: expect.stringContaining("format")
        }));
    });

    it("return status 400 if the task is not found.", () => {
        err = new TaskNotFound();
        controller(err, req, res, next);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledWith(expect.objectContaining({
            msg: expect.stringContaining("found")
        }));
    });

    it("return 400 if if time reversed.", () => {
        err = new TimeReverse();
        controller(err, req, res, next);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledWith(expect.objectContaining({
            msg: expect.stringContaining("reverse")
        }));
    });

    it("return status 403 if the account is not allowed to operate the task.", () => {
        err = new NotAllowed();
        controller(err, req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.json).toBeCalledWith(expect.objectContaining({
            msg: expect.stringContaining("allow")
        }));
    });

    it("forward error if the error is unknown for this controller.", () => {
        err = new Error();
        controller(err, req, res, next);
        expect(next).toBeCalledWith(expect.any(Error));
    });
});