import {
    TaskRepository,
    ChangeExpectTimeResult,
    addTask,
    removeTask,
    changeExpectTime,
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

describe("add task", () => {
    it("success if no same task.", async () => {
        const result = await addTask(account, project, goal, expectTime, repo);

        expect(result).toBe(AddTaskResult.Success);
    });

    it("fail if there is duplicated task.", async () => {
        await addTask(account, project, goal, expectTime, repo);
        const result = await addTask(account, project, goal, expectTime, repo);

        expect(result).toBe(AddTaskResult.Duplicated);
    });

    it("fail if expect time is not positive.", async () => {
        expectTime = 0;

        expect(addTask(account, project, goal, expectTime, repo)).rejects.toThrow();
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

describe("task-modify service", () => {
    beforeEach(async () => {
        await addTask(account, project, goal, expectTime, repo);
    });

    describe("change expect time", () => {
        it("success if the expectTime is a positive number.", async () => {
            const newExpectTime = 2;

            const result = await changeExpectTime(account, project, goal, newExpectTime, repo);
            const task = await repo.getTask(account, project, goal);

            expect(result).toBe(ChangeExpectTimeResult.Success);
            expect(repo.save).toBeCalledTimes(1);
            expect(task.expectTime).toBe(newExpectTime);
        });

        it("fail if the expectTime is not a positive number.", async () => {
            const newExpectTime = 0;

            const result = await changeExpectTime(account, project, goal, newExpectTime, repo);
            const task = await repo.getTask(account, project, goal);

            expect(result).toBe(ChangeExpectTimeResult.InvalidPeriod);
            expect(repo.save).not.toBeCalled();
            expect(task.expectTime).toBe(expectTime);
        });
    });

    describe("start task", () => {
        it("success if the task has not yet been started.", async () => {
            const time: Date = new Date();

            const result = await startTask(account, project, goal, time, repo);

            expect(result).toBe(StartTaskResult.Success);
            expect(repo.save).toBeCalledTimes(1);
        });

        it("fail if the task has been started.", async () => {
            const time: Date = new Date();
            startTask(account, project, goal, time, repo);

            const result = await startTask(account, project, goal, time, repo);

            expect(result).toBe(StartTaskResult.HasStarted);
            expect(repo.save).toBeCalledTimes(1);
        });
    });

    describe("stop task", () => {
        it("fail if the task has not been started.", async () => {
            const stopTime = new Date();

            const result = await stopTask(account, project, goal, stopTime, repo);

            expect(result).toBe(StopTaskResult.NotInRunning);
            expect(repo.save).not.toBeCalled();
        });

        it("success if the stop time is after start time.", async () => {
            const startTime = new Date();
            const stopTime = new Date(startTime.getTime() + 1);

            await startTask(account, project, goal, startTime, repo);
            const result = await stopTask(account, project, goal, stopTime, repo);

            expect(result).toBe(StopTaskResult.Success);
            expect(repo.save).toBeCalledTimes(2);
        });

        it("fail if the stop time is before start time.", async () => {
            const startTime = new Date();
            const stopTime = new Date(startTime.getTime() - 1);

            await startTask(account, project, goal, startTime, repo);
            const result = await stopTask(account, project, goal, stopTime, repo);

            expect(result).toBe(StopTaskResult.NotInRunning);
            expect(repo.save).toBeCalledTimes(1);
        });
    });
});