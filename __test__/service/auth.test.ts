import { AuthRepository, AuthView, Signup, ValidateLogin } from "../../src/service/auth";

let account: string;
let password: string;
let storage: TestAuthStorage;

beforeEach(() => {
    account = "test account";
    password = "test password";
    storage = new TestAuthStorage();
});

describe("sign up", () => {
    let signup: Signup;

    beforeEach(() => {
        const repo: AuthRepository = storage;
        signup = new Signup(repo);
    });

    it("success if no duplication.", async () => {
        const result = await signup.execute(account, password);

        expect(result).toBeTruthy();
    });

    it("fail if has same account.", async () => {
        await signup.execute(account, password);
        const result = await signup.execute(account, password);

        expect(result).toBeFalsy();
    });
});

describe("validate", () => {
    let signup: Signup;
    let validateLogin: ValidateLogin;

    beforeEach(() => {
        const repo: AuthRepository = storage;
        const view: AuthView = storage;
        signup = new Signup(repo);
        validateLogin = new ValidateLogin(view);
    });
    it("success if account exists and password is correct.", async () => {
        await signup.execute(account, password);
        const result = await validateLogin.execute(account, password);

        expect(result).toBeTruthy();
    });

    it("fail if no account.", async () => {
        const result = await validateLogin.execute(account, password);

        expect(result).toBeFalsy();
    });

    it("fail if password is wrong.", async () => {
        const repo: AuthRepository = storage;
        await signup.execute(account, password);
        const wrongPassword = "wrong";
        const view: AuthView = storage;

        const result = await validateLogin.execute(account, wrongPassword);

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