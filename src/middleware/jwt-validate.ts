import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "../config";

export const jwtValidate = async (req: Request, res: Response, next: NextFunction) => {
    const token = getJWTFromHeaders(req.headers);

    if (!token) {
        res.status(400);
        return res.json({ msg: "the authorization field in header should have the format \"Baerer ${jwt}\"" });
    }

    try {
        const decoded = await new Promise((resolve, reject) =>
            jwt.verify(token, config.jwtSecret, (error, decoded) =>
                error ? reject(error) : resolve(decoded)
            )
        );
        req.body.account = (decoded as jwt.JwtPayload).account;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401);

            if (error.message.includes("signature")) {
                return res.json({ msg: "wrong signature" });
            } else if (error.message.includes("expire")) {
                return res.json({ msg: "expire" });
            }
        }
        res.status(500);
        return res.json({});
    }
};

function getJWTFromHeaders(headers: any): string | undefined {
    if (!headers.authorization) {
        return undefined;
    }
    const segments = headers.authorization.split(" ");
    if (segments.length < 2) {
        return undefined;
    } else {
        return segments[1];
    }
}