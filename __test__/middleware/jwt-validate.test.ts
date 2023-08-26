import { Request, Response, NextFunction } from "express";
import { sign as jwtSign } from "jsonwebtoken";
import { jwtValidate } from "../../src/middleware/jwt-validate";
import { config } from "../../src/config";

let account: string;
let res: Response;
let next: NextFunction;

beforeEach(() => {
    account = "test";
    res = { json: jest.fn(), status: jest.fn() } as unknown as Response;
    next = jest.fn();
});

describe("jwt validate", () => {
    it("pass if the token is valid.", async () => {
        const jwt = jwtSign({ account }, config.jwtSecret);
        const req = getReqWithJWT(jwt);

        await jwtValidate(req, res, next);

        expect(req.body.account).toBe(account);
        expect(next).toBeCalledTimes(1);
    });

    it("reject if the token has invalid signature.", async () => {
        const jwt = jwtSign({ account }, "wrong secret");
        const req = getReqWithJWT(jwt);

        await jwtValidate(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toBeCalledWith(401);
        expect(res.json).toBeCalledTimes(1);
    });

    it("reject if the token has expired.", async () => {
        const jwt = jwtSign({ account }, config.jwtSecret, { expiresIn: "1ms" });
        const req = getReqWithJWT(jwt);

        await sleep(2);
        await jwtValidate(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toBeCalledWith(401);
        expect(res.json).toBeCalledTimes(1);
    });

    it("reject if the format of authorization in header is wrong.", async () => {
        const jwt = jwtSign({ account }, config.jwtSecret);
        const req = { headers: { authorization: `${jwt}` }, body: {} } as Request;

        await jwtValidate(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledTimes(1);
    });
});

function getReqWithJWT(jwt: string): Request {
    return {
        headers: { authorization: `Bearer ${jwt}` },
        body: {}
    } as Request;
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}