import { Db, MongoClient } from "mongodb";
import { AuthRepoMongo } from "../../src/storage/auth/auth-repo-mongo";
import { testConfig } from "../test-config";
import { AuthRepository, AuthView } from "../../src/service/auth";
import { AuthViewMongo } from "../../src/storage/auth/auth-view-mongo";

let client: MongoClient;
let db: Db;
const dbName = "test-auth-mongo";
let userCollName = "test-user";
let repo: AuthRepository;
let view: AuthView;

beforeAll(async () => {
    const uri = testConfig.mongodbUri;
    client = await MongoClient.connect(uri);
    db = client.db(dbName);
    await db.dropDatabase();
});

beforeEach(async () => {
    await db.collection(userCollName).createIndex({ account: 1 }, { unique: true });
    repo = new AuthRepoMongo(db, userCollName);
    view = new AuthViewMongo(db, userCollName);
});

afterEach(async () => {
    await client.db(dbName).dropCollection(userCollName);
});

afterAll(async () => {
    await db.dropDatabase();
    await client.close();
});

describe("AuthRepoMongo", () => {
    it("return true if no same account.", async () => {
        const account = "test-account";
        const password = "test-password";

        const result = await repo.addUser(account, password);

        expect(result).toBeTruthy();
    });

    it("return false if same account exist.", async () => {
        const account = "test-account";
        const password = "test-password";

        await repo.addUser(account, password);
        const result = await repo.addUser(account, password);

        expect(result).toBeFalsy();
    });
});

describe("AuthView", () => {
    it("return undefined if the account does not exist.", async () => {
        const account = "test-account";
        const password = "test-password";

        const result = await view.getPassword(account);

        expect(result).toBe(undefined);
    });

    it("return password if the account exists.", async () => {
        const account = "test-account";
        const password = "test-password";
        repo.addUser(account, password);

        const result = await view.getPassword(account);

        expect(result).toBe(password);
    });
});