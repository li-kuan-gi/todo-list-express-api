import { Request, Response } from "express";
import { ISignup } from "@auth/service";
import { SignupContainer, getSignupController } from "@controller/auth";

let req: Request;
let res: Response;
let controller: (req: Request, res: Response) => any;

beforeEach(() => {
    req = {} as Request;
    res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() } as unknown as Response;
    const container = { getSignupService: () => new FakeSignup() };
    controller = getSignupController(container);
});

describe("signup", () => {
    it("return status 200 if signup success.", async () => {
        req.body = { account: "not exist one", password: "pwd" };
        await controller(req, res);
        expect(res.status).toBeCalledWith(200);
    });

    it("return status 409 if signup fail.", async () => {
        req.body = { account: "exist one", password: "pwd" };
        await controller(req, res);
        expect(res.status).toBeCalledWith(409);
    });
});

class FakeSignup implements ISignup {
    async execute(account: string, password: string): Promise<boolean> {
        return !(account === "exist one");
    }
}