import { Db, MongoClient } from "mongodb";
import { AuthRepoMongo } from "../../src/storage/auth-repo-mongo";

let client: MongoClient;
let db: Db;

beforeAll(async () => {
    const uri = process.env.MONGODB_TEST_URI as string;
    client = await MongoClient.connect(uri);
    await client.db("test-auth-repo-mongo").dropDatabase();
    db = client.db("test-auth-repo-mongo");
});

beforeEach(async () => {
    await db.collection("user").createIndex({ account: 1 }, { unique: true });
});

afterEach(async () => {
    await client.db("test-auth-repo-mongo").dropCollection("user");
});

afterAll(async () => {
    await db.dropDatabase();
    await client.close();
});

describe("AuthRepoMongo", () => {
    it("return true if no same account.", async () => {
        const repo = new AuthRepoMongo(db);
        const account = "test";
        const password = "test";

        const result = await repo.addUser(account, password);

        expect(result).toBeTruthy();
    });

    it("return false if same account exist.", async () => {
        const repo = new AuthRepoMongo(db);
        const account = "test";
        const password = "test";

        await repo.addUser(account, password);
        const result = await repo.addUser(account, password);

        expect(result).toBeFalsy();
    });
});