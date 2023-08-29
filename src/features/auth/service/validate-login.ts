import bcrypt from "bcrypt";
import { AuthView } from "./view";

export interface IValidateLogin {
    execute(account: string, password: string): Promise<boolean>;
}

export class ValidateLogin implements IValidateLogin {
    private readonly view: AuthView;

    constructor(view: AuthView) {
        this.view = view;
    }

    async execute(account: string, password: string): Promise<boolean> {
        const cipher = await this.view.getPassword(account);

        if (!cipher) {
            return false;
        } else {
            return await bcrypt.compare(password, cipher);
        }
    }
}