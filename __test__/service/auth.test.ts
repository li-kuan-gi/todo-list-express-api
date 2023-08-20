import { AuthRepository, AuthView, signup, validate } from "../../src/service/auth";

let account: string;
let password: string;
let storage: TestAuthStorage;

beforeEach(() => {
    account = "test account";
    password = "test password";
    storage = new TestAuthStorage();
});

describe("sign up", () => {
    it("success if no duplication.", async () => {
        const repo: AuthRepository = storage;

        const result = await signup(account, password, repo);

        expect(result).toBeTruthy();
    });

    it("fail if has same account.", async () => {
        const repo: AuthRepository = storage;

        await signup(account, password, repo);
        const result = await signup(account, password, storage);

        expect(result).toBeFalsy();
    });
});

describe("validate", () => {
    it("success if account exists and password is correct.", async () => {
        const repo: AuthRepository = storage;
        await signup(account, password, repo);
        const view: AuthView = storage;

        const result = await validate(account, password, view);

        expect(result).toBeTruthy();
    });

    it("fail if no account.", async () => {
        const view: AuthView = storage;

        const result = await validate(account, password, view);

        expect(result).toBeFalsy();
    });

    it("fail if password is wrong.", async () => {
        const repo: AuthRepository = storage;
        await signup(account, password, repo);
        const wrongPassword = "wrong";
        const view: AuthView = storage;

        const result = await validate(account, wrongPassword, view);

        expect(result).toBeFalsy();
    });
});

class TestAuthStorage implements AuthRepository, AuthView {
    private readonly infos: { account: string, password: string; }[];

    constructor() {
        this.infos = [];
    }

    async addUser(account: string, password: string): Promise<boolean> {
        if (this.infos.find(info => info.account === account)) {
            return false;
        } else {
            this.infos.push({ account, password });
            return true;
        }
    }

    async getPassword(account: string): Promise<string | undefined> {
        const info = this.infos.find(info => info.account === account);
        return info ? info.password : undefined;
    }
}