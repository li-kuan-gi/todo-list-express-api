import bcrypt from "bcrypt";
import { AuthRepository } from "./repository";

export interface ISignup {
    execute(account: string, password: string): Promise<boolean>;
}

export class Signup implements ISignup {
    private readonly repo: AuthRepository;

    constructor(repo: AuthRepository) {
        this.repo = repo;
    }

    async execute(account: string, password: string): Promise<boolean> {
        const cipher = await bcrypt.hash(password, 10);
        const result = await this.repo.addUser(account, cipher);

        return result;
    }
}