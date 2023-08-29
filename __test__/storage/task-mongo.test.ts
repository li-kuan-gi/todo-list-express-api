import { Collection, Db, MongoClient } from "mongodb";
import { TaskInfo, TaskRepository, TaskView } from "@task/service";
import { TaskNotFound, TaskRepoMongo, TaskViewMongo } from "@task/storage";
import { Task } from "@task/domain";
import { testConfig } from "../test-config";

let client: MongoClient;
let db: Db;
let coll: Collection;
const taskCollName = "test-task-coll";

beforeAll(async () => {
    const uri = testConfig.mongodbUri;
    client = await MongoClient.connect(uri);
    db = client.db("test-task-mongo");
    coll = db.collection(taskCollName);
    await coll.createIndex({ account: 1, project: 1, goal: 1 }, { unique: true });
});

beforeEach(async () => {
    await coll.deleteMany({});
});

afterAll(async () => {
    await db.dropDatabase();
    await client.close();
});

describe("task repo", () => {
    let repo: TaskRepository;

    beforeEach(() => {
        repo = new TaskRepoMongo(db, taskCollName);
    });

    describe("add task", () => {
        it("success if no same task.", async () => {
            const task = new Task("acc", "pro", "goal", 1);

            const result = await repo.add(task);

            expect(typeof result).toBe("string");
        });

        it("fail if same task has existed.", async () => {
            const task1 = new Task("acc", "pro", "goal", 1);
            const task2 = new Task("acc", "pro", "goal", 2);

            await repo.add(task1);
            const result = await repo.add(task2);

            expect(typeof result).toBe("undefined");
        });
    });

    describe("remove task", () => {
        it("success if the task exists", async () => {
            const task = new Task("acc", "pro", "goal", 1);
            const id = await repo.add(task) as string;

            expect(repo.remove(id)).resolves.toBe(undefined);
        });

        it("fail if the task not exists.", async () => {
            expect(repo.remove("123456789123456789123456")).rejects.toBeInstanceOf(TaskNotFound);
        });
    });

    describe("get task", () => {
        it("whose constructor fields are filled.", async () => {
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

    describe("save task", () => {
        it("save changes to task", async () => {
            const id = await repo.add(new Task("acc", "proj", "goal", 1)) as string;
            const task = await repo.getTaskByID(id);
            const duration = 10;
            const startTime = new Date();
            const stopTime = new Date(startTime.getTime() + 1);
            const resumeTime = new Date(startTime.getTime() + 2);
            const completeTime = new Date(startTime.getTime() + 3);

            task.expect(duration);
            task.start(startTime);
            task.stop(stopTime);
            task.resume(resumeTime);
            task.complete(completeTime);
            await repo.save(task);
            const fetched = await repo.getTaskByID(id);

            expect(fetched.expectDuration).toBe(task.expectDuration);
            expect(fetched.startTime).toStrictEqual(task.startTime);
            expect(fetched.stopTimes).toStrictEqual(task.stopTimes);
            expect(fetched.resumeTimes).toStrictEqual(task.resumeTimes);
            expect(fetched.completeTime).toStrictEqual(task.completeTime);
        });
    });
});

describe("task view", () => {
    let repo: TaskRepository;
    let view: TaskView;

    beforeEach(() => {
        repo = new TaskRepoMongo(db, taskCollName);
        view = new TaskViewMongo(db, taskCollName);
    });

    describe("list", () => {
        it("list all task", async () => {
            const startTime = new Date();
            const info1: TaskInfo = {
                tid: "1",
                account: "a1",
                project: "p1",
                goal: "g1",
                expectDuration: 1,
                stopTimes: [],
                resumeTimes: [],
                startTime: startTime,
                completeTime: undefined
            };
            const info2: TaskInfo = {
                tid: "2",
                account: "a2",
                project: "p2",
                goal: "g2",
                expectDuration: 2,
                stopTimes: [],
                resumeTimes: [],
                startTime: undefined,
                completeTime: undefined
            };
            const task1 = new Task(info1.account, info1.project, info1.goal, info1.expectDuration);
            task1.start(startTime);
            const task2 = new Task(info2.account, info2.project, info2.goal, info2.expectDuration);
            const id1 = await repo.add(task1) as string;
            const id2 = await repo.add(task2) as string;
            info1.tid = id1;
            info2.tid = id2;

            const result = await view.list();

            expect(result).toStrictEqual([info1, info2]);
        });
    });
});