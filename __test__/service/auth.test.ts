import { AuthRepository, GetAccountInfos, signup, validate } from "../../src/service/auth";

let repo: TestAuthRepository;

beforeEach(() => {
    repo = new TestAuthRepository();
});

describe("sign up", () => {
    it("success if no duplication.", async () => {
        const account: string = "test";
        const password: string = "test";

        const result = await signup(account, password, repo);

        expect(result).toBeTruthy();
    });

    it("fail if has same account.", async () => {
        const account: string = "test";
        const password: string = "test";

        await signup(account, password, repo);
        const result = await signup(account, password, repo);

        expect(result).toBeFalsy();
    });
});

describe("validate", () => {
    it("success if account exists and password is correct.", async () => {
        const account: string = "test";
        const password: string = "test";
        const getInfo: GetAccountInfos = async () => await repo.getAccountInfo();
        await signup(account, password, repo);

        const result = await validate(account, password, getInfo);

        expect(result).toBeTruthy();
    });

    it("fail if no account.", async () => {
        const account: string = "test";
        const password: string = "test";
        const getInfo: GetAccountInfos = async () => await repo.getAccountInfo();

        const result = await validate(account, password, getInfo);

        expect(result).toBeFalsy();
    });

    it("fail if password is wrong.", async () => {
        const account: string = "test";
        const password: string = "test";
        const wrongPassword = "wrong";
        const getInfo: GetAccountInfos = async () => await repo.getAccountInfo();
        await signup(account, password, repo);

        const result = await validate(account, wrongPassword, getInfo);

        expect(result).toBeFalsy();
    });
});

class TestAuthRepository implements AuthRepository {
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

    async getAccountInfo() {
        return this.infos;
    }
}