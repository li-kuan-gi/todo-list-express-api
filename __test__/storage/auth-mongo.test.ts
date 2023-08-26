import { Db, MongoClient } from "mongodb";
import { AuthRepoMongo } from "../../src/storage/auth-repo-mongo";
import { AuthViewMongo } from "../../src/storage/auth-view-mongo";
import { config } from "../../src/config";
import { testConfig } from "../test-config";

let client: MongoClient;
let db: Db;
const dbName = "test-auth-mongo";

beforeAll(async () => {
    const uri = testConfig.mongodbUri;
    client = await MongoClient.connect(uri);
    await client.db(dbName).dropDatabase();
    db = client.db(dbName);
});

beforeEach(async () => {
    await db.collection(config.userCollName).createIndex({ account: 1 }, { unique: true });
});

afterEach(async () => {
    await client.db(dbName).dropCollection("user");
});

afterAll(async () => {
    await db.dropDatabase();
    await client.close();
});

describe("AuthRepoMongo", () => {
    it("return true if no same account.", async () => {
        const repo = new AuthRepoMongo(db);
        const account = "test-account";
        const password = "test-password";

        const result = await repo.addUser(account, password);

        expect(result).toBeTruthy();
    });

    it("return false if same account exist.", async () => {
        const repo = new AuthRepoMongo(db);
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
        const view = new AuthViewMongo(db);

        const result = await view.getPassword(account);

        expect(result).toBe(undefined);
    });

    it("return password if the account exists.", async () => {
        const account = "test-account";
        const password = "test-password";
        new AuthRepoMongo(db).addUser(account, password);
        const view = new AuthViewMongo(db);

        const result = await view.getPassword(account);

        expect(result).toBe(password);
    });
});