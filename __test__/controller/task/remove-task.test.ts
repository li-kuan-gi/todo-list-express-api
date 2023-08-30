import { RemoveTaskContainer, getRemoveTaskController } from "@controller/task";
import { WrongFormat } from "@controller/wrong-format";
import { IRemoveTask } from "@task/service";
import { TaskNotFound } from "@task/storage";
import { NextFunction, Request, Response } from "express";

describe("remove task controller", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let removeTask: (req: Request, res: Response, next: NextFunction) => any;

    beforeEach(() => {
        req = {
            body: { id: "exist" }
        } as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as unknown as Response;

        next = jest.fn();

        const container: RemoveTaskContainer = { getRemoveTask: () => new FakeRemoveTask() };
        removeTask = getRemoveTaskController(container);
    });

    it("return status 200 if the task exists.", async () => {
        await removeTask(req, res, next);

        expect(res.status).toBeCalledWith(200);
    });

    it("forward a TaskNotFound error if the error occurs.", async () => {
        req.body.id = "not exist";
        await removeTask(req, res, next);
        expect(next).toBeCalledWith(expect.any(TaskNotFound));
    });

    it("forward a WrongFormat error if the id is not a string.", async () => {
        req.body.id = 0;
        await removeTask(req, res, next);
        expect(next).toBeCalledWith(expect.any(WrongFormat));
    });
});

class FakeRemoveTask implements IRemoveTask {
    async execute(id: string): Promise<void> {
        if (id === "not exist") {
            throw new TaskNotFound();
        }
    };
}