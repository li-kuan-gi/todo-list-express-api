import { Collection, Db, MongoClient } from "mongodb";
import { config } from "../../src/config";
import { Task } from "../../src/entity/task";
import { TaskRepoMongo } from "../../src/storage/task-repo-mongo";
import { TaskNotFound } from "../../src/service/task";

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

describe("remove task", () => {
    it("success if the task exists", async () => {
        const repo = new TaskRepoMongo(db);
        const task = new Task("acc", "pro", "goal", 1);
        const id = await repo.add(task) as string;

        expect(repo.remove(id)).resolves.toBe(undefined);
    });

    it("fail if the task not exists.", async () => {
        const repo = new TaskRepoMongo(db);

        expect(repo.remove("123456789123456789123456")).rejects.toBeInstanceOf(TaskNotFound);
    });
});

describe("get task", () => {
    it("whose constructor fields are filled.", async () => {
        const repo = new TaskRepoMongo(db);
        const account = "acc";
        const project = "proj";
        const goal = "goal";
        const expectDuration = 1;

        const id = await repo.add(new Task(account, project, goal, expectDuration)) as string;
        const task = await repo.getTaskByID(id);

        expect(task.account).toBe(account);
        expect(task.project).toBe(project);
        expect(task.goal).toBe(goal);
        expect(task.expectDuration).toBe(expectDuration);
    });

    it("whose private fields are filled.", async () => {
        const repo = new TaskRepoMongo(db);
        const task = new Task("acc", "pro", "goal", 1);
        const startTime = new Date();
        const stopTime = new Date(startTime.getTime() + 1);
        task.start(startTime);
        task.stop(stopTime);

        const id = await repo.add(task) as string;
        const taskDerived = await repo.getTaskByID(id);

        expect(taskDerived.startTime).toStrictEqual(startTime);
        expect(taskDerived.completeTime).toStrictEqual(undefined);
        expect(taskDerived.stopTimes).toStrictEqual([stopTime]);
        expect(taskDerived.resumeTimes).toStrictEqual([]);
    });
});