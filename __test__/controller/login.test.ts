import { Request, Response } from "express";
import { IValidateLogin } from "../../src/service/auth";
import { getLoginController } from "../../src/controller/login";

let req: Request;
let res: Response;
let validate: IValidateLogin;

beforeEach(() => {
    req = {} as Request;
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    } as unknown as Response;
    validate = new FakeValidateLogin();
});

describe("login controller", () => {
    it("return status 200 if login success.", async () => {
        req.body = { account: "test", password: "valid" };
        const controller = getLoginController(validate);
        await controller(req, res);
        expect(res.status).toBeCalledWith(200);
    });

    it("return status 401 if data is wrong.", async () => {
        req.body = { account: "test", password: "invalid" };
        const controller = getLoginController(validate);
        await controller(req, res);
        expect(res.status).toBeCalledWith(401);
    });
});

class FakeValidateLogin implements IValidateLogin {
    async execute(account: string, password: string): Promise<boolean> {
        return password === "valid";
    }
}