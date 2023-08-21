import {
    TaskRepository,
    SetExpectTimeResult,
    addTask,
    removeTask,
    setExpectTime,
    StartTaskResult,
    startTask,
    AddTaskResult,
    TaskNotFound,
    StopTaskResult,
    stopTask
} from "../../src/service/task";
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

        expect(result).toBe(AddTaskResult.Success);
    });

    it("fail if there is duplicated task.", async () => {
        await addTask(account, project, goal, expectTime, repo);
        const result = await addTask(account, project, goal, expectTime, repo);

        expect(result).toBe(AddTaskResult.Duplicated);
    });
});

describe("remove task", () => {
    it("success if there is such task.", async () => {
        await addTask(account, project, goal, expectTime, repo);

        expect(removeTask(account, project, goal, repo)).resolves.toBe(undefined);
    });

    it("throw if no such task", async () => {
        expect(removeTask(account, project, goal, repo)).rejects.toBeInstanceOf(TaskNotFound);
    });
});

describe("setExpectTime", () => {
    it("success if the expectTime is a positive number.", async () => {
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

    it("throw if no such task", async () => {
        expect(setExpectTime(account, project, goal, 1, repo)).rejects.toBeInstanceOf(TaskNotFound);
    });
});

describe("start task", () => {
    it("success if the task has not yet been started.", async () => {
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

    it("throw if no such task", async () => {
        expect(startTask(account, project, goal, new Date(), repo)).rejects.toBeInstanceOf(TaskNotFound);
    });
});

describe("stop task", () => {
    it("success after starting task.", async () => {
        const startTime = new Date();
        const stopTime = new Date(startTime.getTime() + 1);
        await addTask(account, project, goal, 1, repo);

        await startTask(account, project, goal, startTime, repo);
        const result = await stopTask(account, project, goal, stopTime, repo);

        expect(result).toBe(StopTaskResult.Success);
    });

    it("fail if the task has not been started.", async () => {
        const stopTime = new Date();
        await addTask(account, project, goal, 1, repo);

        const result = await stopTask(account, project, goal, stopTime, repo);

        expect(result).toBe(StopTaskResult.NotInRunning);
    });
});