import { Request, Response } from "express";
import { IValidateLogin } from "@auth/service";
import { getLoginController } from "@controller/auth";

let req: Request;
let res: Response;
let validate: IValidateLogin;
let jwtSecret = "secret";
let controller: (req: Request, res: Response) => any;

beforeEach(() => {
    req = {} as Request;
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    } as unknown as Response;
    validate = new FakeValidateLogin();
    controller = getLoginController(validate, jwtSecret);
});

describe("login controller", () => {
    it("return status 200 if login success.", async () => {
        req.body = { account: "test", password: "valid" };
        await controller(req, res);
        expect(res.status).toBeCalledWith(200);
    });

    it("return status 401 if data is wrong.", async () => {
        req.body = { account: "test", password: "invalid" };
        await controller(req, res);
        expect(res.status).toBeCalledWith(401);
    });
});

class FakeValidateLogin implements IValidateLogin {
    async execute(account: string, password: string): Promise<boolean> {
        return password === "valid";
    }
}