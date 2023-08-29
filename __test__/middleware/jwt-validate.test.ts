import { getJwtValidateMiddleware } from "@controller/auth";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

let account: string;
let res: Response;
let next: NextFunction;
let jwtSecret: string;

beforeEach(() => {
    account = "test";
    res = { json: jest.fn(), status: jest.fn() } as unknown as Response;
    next = jest.fn();
    jwtSecret = "secret";
});

describe("jwt validate", () => {
    it("pass if the token is valid.", async () => {
        const token = jwt.sign({ account }, jwtSecret);
        const req = getReqWithJWT(token);

        await getJwtValidateMiddleware(jwtSecret)(req, res, next);

        expect(req.body.account).toBe(account);
        expect(next).toBeCalledTimes(1);
    });

    it("reject if the token has invalid signature.", async () => {
        const token = jwt.sign({ account }, "wrong secret");
        const req = getReqWithJWT(token);

        await getJwtValidateMiddleware(jwtSecret)(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toBeCalledWith(401);
        expect(res.json).toBeCalledTimes(1);
    });

    it("reject if the token has expired.", async () => {
        const token = jwt.sign({ account }, jwtSecret, { expiresIn: "1ms" });
        const req = getReqWithJWT(token);

        await sleep(2);
        await getJwtValidateMiddleware(jwtSecret)(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toBeCalledWith(401);
        expect(res.json).toBeCalledTimes(1);
    });

    it("reject if the format of authorization in header is wrong.", async () => {
        const token = jwt.sign({ account }, jwtSecret);
        const req = { headers: { authorization: `${token}` }, body: {} } as Request;

        await getJwtValidateMiddleware(jwtSecret)(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledTimes(1);
    });
});

function getReqWithJWT(token: string): Request {
    return {
        headers: { authorization: `Bearer ${token}` },
        body: {}
    } as Request;
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}