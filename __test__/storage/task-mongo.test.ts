import { Collection, Db, MongoClient } from "mongodb";
import { config } from "../../src/config";
import { Task } from "../../src/entity/task";
import { TaskRepoMongo } from "../../src/storage/task-repo-mongo";

let client: MongoClient;
let db: Db;
let coll: Collection<Task>;

beforeAll(async () => {
    const uri = process.env.MONGODB_TEST_URI as string;
    client = await MongoClient.connect(uri);
    db = client.db("test-task-mongo");
    coll = db.collection<Task>(config.taskCollName);
    await coll.createIndex({ account: 1, project: 1, goal: 1 }, { unique: true });
});

beforeEach(async () => {
    await coll.deleteMany({});
});

afterAll(async () => {
    await db.dropDatabase();
    await client.close();
});

describe("add task", () => {
    it("success if no same task.", async () => {
        const repo = new TaskRepoMongo(db);
        const task = new Task("acc", "pro", "goal", 1);

        const result = await repo.add(task);

        expect(typeof result).toBe("string");
    });

    it("fail if same task has existed.", async () => {
        const repo = new TaskRepoMongo(db);
        const task1 = new Task("acc", "pro", "goal", 1);
        const task2 = new Task("acc", "pro", "goal", 2);

        await repo.add(task1);
        const result = await repo.add(task2);

        expect(typeof result).toBe("undefined");
    });
});