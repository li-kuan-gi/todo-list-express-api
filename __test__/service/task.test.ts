import { TaskRepository, SetExpectTimeResult, addTask, removeTask, setExpectTime, StartTaskResult, startTask } from "../../src/service/task";
import { TestTaskStorage } from "./test-task-storage";

let account: string;
let project: string;
let goal: string;
let expectTime: number;
let storage: TestTaskStorage;
let repo: TaskRepository;

beforeEach(() => {
    storage = new TestTaskStorage();
    repo = storage;
    account = "test account";
    project = "test project";
    goal = "test goal";
    expectTime = 35;
});

describe("addTask", () => {
    it("success if no same task.", async () => {
        const result = await addTask(account, project, goal, expectTime, repo);

        expect(result).toBeTruthy();
    });

    it("fail if there is duplicated task.", async () => {
        await addTask(account, project, goal, expectTime, repo);
        const result = await addTask(account, project, goal, expectTime, repo);

        expect(result).toBeFalsy();
    });
});

describe("remove task", () => {
    it("success if there is such task.", async () => {
        await addTask(account, project, goal, expectTime, repo);

        const result = await removeTask(account, project, goal, repo);

        expect(result).toBeTruthy();
    });

    it("fail if there is no such task.", async () => {
        const result = await removeTask(account, project, goal, repo);

        expect(result).toBeFalsy();
    });
});

describe("setExpectTime", () => {
    it("success if the expectTime is a positive number and there is such task.", async () => {
        const newExpectTime = 2;
        await addTask(account, project, goal, expectTime, repo);

        const result = await setExpectTime(account, project, goal, newExpectTime, repo);

        expect(result).toBe(SetExpectTimeResult.Success);
    });

    it("fail if the expectTime is not a positive number.", async () => {
        const newExpectTime = 0;
        await addTask(account, project, goal, expectTime, repo);

        const result = await setExpectTime(account, project, goal, newExpectTime, repo);

        expect(result).toBe(SetExpectTimeResult.InvalidPeriod);
    });

    it("fail if there is no such task.", async () => {
        const newExpectTime = 2;

        const result = await setExpectTime(account, project, goal, newExpectTime, repo);

        expect(result).toBe(SetExpectTimeResult.NotFound);
    });
});

describe("start task", () => {
    it("success if the task has not been yet started.", async () => {
        const time: Date = new Date();
        await addTask(account, project, goal, expectTime, repo);

        const result = await startTask(account, project, goal, time, repo);

        expect(result).toBe(StartTaskResult.Success);
    });

    it("fail if the task has been started.", async () => {
        const time: Date = new Date();
        await addTask(account, project, goal, expectTime, repo);
        startTask(account, project, goal, time, repo);

        const result = await startTask(account, project, goal, time, repo);

        expect(result).toBe(StartTaskResult.HasStarted);
    });

    it("fail if there is no such task.", async () => {
        const time: Date = new Date();

        const result = await startTask(account, project, goal, time, repo);

        expect(result).toBe(StartTaskResult.NotFound);
    });
});