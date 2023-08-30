import { Request, Response } from "express";
import { ISignup } from "@auth/service";
import { isString } from "@src/helper";

export const getSignupController = (container: SignupContainer) =>
    async (req: Request, res: Response) => {
        const reqAccount = req.body.account;
        const reqPassword = req.body.password;

        if (!(isString(reqAccount) && isString(reqPassword))) {
            return res.status(400).json({ msg: "The format of account or password is invalid." });
        }

        const account = reqAccount as string;
        const password = reqPassword as string;

        try {
            const signup = container.getSignupService();
            const result = await signup.execute(account, password);

            if (result) {
                res.status(200).json({});
            } else {
                res.status(409).json({ msg: "The account has already existed." });
            }
        } catch (e) {
            res.status(500).json({});
        }
    };

export interface SignupContainer {
    getSignupService(): ISignup;
}