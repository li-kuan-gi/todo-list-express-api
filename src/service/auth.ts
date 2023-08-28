import bcrypt from "bcrypt";

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

export interface AuthRepository {
    addUser(account: string, password: string): Promise<boolean>;
}

export class ValidateSignin {
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

export interface AuthView {
    getPassword: (account: string) => Promise<string | undefined>;
}