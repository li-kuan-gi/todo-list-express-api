import { AuthRepository, AuthView, signup, validate } from "../../src/service/auth";

let storage: TestAuthStorage;

beforeEach(() => {
    storage = new TestAuthStorage();
});

describe("sign up", () => {
    it("success if no duplication.", async () => {
        const account: string = "test";
        const password: string = "test";

        const result = await signup(account, password, storage);

        expect(result).toBeTruthy();
    });

    it("fail if has same account.", async () => {
        const account: string = "test";
        const password: string = "test";

        await signup(account, password, storage);
        const result = await signup(account, password, storage);

        expect(result).toBeFalsy();
    });
});

describe("validate", () => {
    it("success if account exists and password is correct.", async () => {
        const account: string = "test";
        const password: string = "test";
        await signup(account, password, storage);

        const result = await validate(account, password, storage);

        expect(result).toBeTruthy();
    });

    it("fail if no account.", async () => {
        const account: string = "test";
        const password: string = "test";

        const result = await validate(account, password, storage);

        expect(result).toBeFalsy();
    });

    it("fail if password is wrong.", async () => {
        const account: string = "test";
        const password: string = "test";
        const wrongPassword = "wrong";
        await signup(account, password, storage);

        const result = await validate(account, wrongPassword, storage);

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