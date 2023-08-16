import { AuthRepository, SignupFailure, SignupSuccess, signup } from "../../src/service/auth";

let repo: AuthRepository;

beforeEach(() => {
    repo = new TestAuthRepository();
});

describe("sign up", () => {
    it("success if no duplication.", async () => {
        const account: string = "test";
        const password: string = "test";

        const result = await signup(account, password, repo);

        expect(result).toBeInstanceOf(SignupSuccess);
    });

    it("fail if has same account.", async () => {
        const account: string = "test";
        const password: string = "test";

        await signup(account, password, repo);

        const result = await signup(account, password, repo);

        expect(result).toBeInstanceOf(SignupFailure);
    });
});

class TestAuthRepository implements AuthRepository {
    private readonly accounts: string[];

    constructor() {
        this.accounts = [];
    }

    async addUser(account: string, password: string): Promise<string | undefined> {
        if (this.accounts.includes(account)) {
            return;
        } else {
            this.accounts.push(account);
            return account;
        }
    }
}