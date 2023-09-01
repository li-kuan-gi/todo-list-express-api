import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { IValidateLogin } from "@auth/service";
import { isString } from "@src/helper";

export const getLoginController = (container: ValidateLoginContainer, jwtSecret: string) =>
    async (req: Request, res: Response) => {
        const reqAccount = req.body.account;
        const reqPassword = req.body.password;

        if (!(isString(reqAccount) && isString(reqPassword))) {
            return res.status(400).json({ msg: "The format of account or password is invalid." });
        }

        const account = reqAccount as string;
        const password = reqPassword as string;

        try {
            const validate = container.getValidateLoginService();
            const result = await validate.execute(account, password);

            if (result) {
                const token = jwt.sign({ account }, jwtSecret, { expiresIn: '1h' });
                return res.status(200).json({ token });
            } else {
                return res.status(401).json({ msg: "account or password is incorrect." });
            }
        } catch (error) {
            res.status(500).json({});
        }
    };

export interface ValidateLoginContainer {
    getValidateLoginService(): IValidateLogin;
}