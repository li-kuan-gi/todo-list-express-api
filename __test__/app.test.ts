import { Db, MongoClient } from "mongodb";
import { Server } from "http";
import { App, AppConfig } from "@src/app";
import { testApiPort, testConfig } from "./test-config";
import { configureDB } from "./configure-db";

let client: MongoClient;
let db: Db;
let server: Server;
let config: AppConfig;
let port: number = testApiPort;

beforeAll(async () => {
    config = testConfig;
    const app = new App(config);
    await app.setup();

    // To configure db, illegally get mongo client
    client = (app as any).container.manager.getMongoClient();
    await configureDB(client, config);
    db = client.db(config.dbName);

    server = app.listen(port);
});

beforeEach(async () => {
    await db.collection(config.userCollName).deleteMany({});
});

afterAll(async () => {
    await db.dropCollection(config.userCollName);
    await db.dropCollection(config.taskCollName);
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

describe("task", () => {
    it("fail if something is wrong in token.", async () => {
        const result = await postAddTask("pro", "goal", 1);
        expect(result.status).toBe(400);
    });

    describe("normal flow", () => {
        let token: string;
        let id: string;

        beforeEach(async () => {
            const account = "acc";
            const password = "pwd";
            await postSignup(account, password);
            const result = await postLogin(account, password);
            token = (await result.json()).token;
            id = (await (await postAddTask("proj", "goal", 1, token)).json()).id;
        });

        afterEach(async () => {
            await db.collection(config.taskCollName).deleteMany({});
        });

        it("case: add task.", async () => {
            const result = await postAddTask("test", "test", 1, token);
            expect(result.status).toBe(200);
            const payload = await result.json();
            expect(typeof payload.id).toBe("string");
        });

        it("case: remove task", async () => {
            const result = await postRemoveTask(id, token);
            expect(result.status).toBe(200);
        });
    });
});

function postSignup(account: string | undefined, password: string | undefined): Promise<Response> {
    const payload: { [k: string]: any; } = {};
    if (account !== undefined) payload["account"] = account;
    if (password !== undefined) payload["password"] = password;

    return fetch(`http://localhost:${port}/signup`, {
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

    return fetch(`http://localhost:${port}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
}

function postAddTask(
    project: string,
    goal: string,
    expectDuration: number,
    token?: string
): Promise<Response> {
    const payload = { project, goal, expectDuration };
    const headers: { [k: string]: any; } = { "Content-Type": "application/json" };

    if (token) headers.Authorization = `Bearer ${token}`;

    return fetch(`http://localhost:${port}/task/add`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
    });
}

function postRemoveTask(id: string, token: string): Promise<Response> {
    return fetch(`http://localhost:${port}/task/remove/${id}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

function parseJWT(token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}