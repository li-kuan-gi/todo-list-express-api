import { Db, MongoClient } from "mongodb";
import { config } from "../src/config";
import { getMongoClient } from "../src/mongodb-client";
import { app } from "../src/app";
import { Server } from "http";
import { testConfig } from "./test-config";

let client: MongoClient;
let db: Db;
let server: Server;

beforeAll(async () => {
    config.mongodbUri = testConfig.mongodbUri;
    client = await getMongoClient();
    await client.db(config.dbName).dropDatabase();
    db = client.db(config.dbName);
    await db.collection(config.userCollName).createIndex({ account: 1 }, { unique: true });

    server = app.listen(config.apiPort);
});

beforeEach(async () => {
    await db.collection(config.userCollName).deleteMany({});
});

afterAll(async () => {
    await db.dropCollection(config.userCollName);
    await db.dropDatabase();
    await client.close();
    server.close();
});

describe("signup api", () => {
    it("success if no same account.", async () => {
        const account = "test";
        const password = "test";

        const result = await postSignup(account, password);

        expect(result.status).toBe(200);
    });

    it("fail if same account existed.", async () => {
        const account = "test";
        const password = "test";

        await postSignup(account, password);
        const result = await postSignup(account, password);

        expect(result.status).toBe(409);
        expect((await result.json()).msg).toContain("exist");
    });

    it("fail if account is absent.", async () => {
        const password = "test";

        const result = await postSignup(undefined, password);

        expect(result.status).toBe(400);
        expect((await result.json()).msg).toContain("format");
    });

    it("fail if password is absent.", async () => {
        const account = "test";

        const result = await postSignup(account, undefined);

        expect(result.status).toBe(400);
        expect((await result.json()).msg).toContain("format");
    });
});

describe("login api", () => {
    it("success if account and password are correct", async () => {
        const account = "test-account";
        const password = "test-password";
        await postSignup(account, password);

        const result = await postLogin(account, password);
        const payload = parseJWT((await result.json()).token);

        expect(result.status).toBe(200);
        expect(payload.account).toBe(account);
    });

    it("fail if no such account.", async () => {
        const account = "test-account";
        const password = "test-password";

        const result = await postLogin(account, password);

        expect(result.status).toBe(401);
        expect((await result.json()).msg).toContain("incorrect");
    });

    it("fail if password is wrong.", async () => {
        const account = "test-account";
        const password = "test-password";
        const wrongPassword = "wrong-password";
        await postSignup(account, password);

        const result = await postLogin(account, wrongPassword);

        expect(result.status).toBe(401);
        expect((await result.json()).msg).toContain("incorrect");
    });

    it("fail if account is absent.", async () => {
        const password = "test";

        const result = await postLogin(undefined, password);

        expect(result.status).toBe(400);
        expect((await result.json()).msg).toContain("format");
    });

    it("fail if password is absent.", async () => {
        const account = "test";

        const result = await postLogin(account, undefined);

        expect(result.status).toBe(400);
        expect((await result.json()).msg).toContain("format");
    });
});

function postSignup(account: string | undefined, password: string | undefined): Promise<Response> {
    const payload: { [k: string]: any; } = {};
    if (account !== undefined) payload["account"] = account;
    if (password !== undefined) payload["password"] = password;

    return fetch(`http://localhost:${config.apiPort}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
}

function postLogin(account: string | undefined, password: string | undefined): Promise<Response> {
    const payload: { [k: string]: any; } = {};
    if (account !== undefined) payload["account"] = account;
    if (password !== undefined) payload["password"] = password;

    return fetch(`http://localhost:${config.apiPort}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
}

function parseJWT(token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}