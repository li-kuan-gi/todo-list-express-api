import {
    TaskRepository,
    ChangeExpectDurationResult,
    addTask,
    removeTask,
    changeExpectDuration,
    StartTaskResult,
    startTask,
    AddTaskResult,
    StopTaskResult,
    stopTask
} from "../../src/service/task";
import { TestTaskStorage } from "./test-task-storage";

let account: string;
let project: string;
let goal: string;
let expectDuration: number;
let storage: TestTaskStorage;
let repo: TaskRepository;

beforeEach(() => {
    storage = new TestTaskStorage();
    repo = storage;
    account = "test account";
    project = "test project";
    goal = "test goal";
    expectDuration = 35;
});

describe("add task", () => {
    it("success if no same task.", async () => {
        const result = await addTask(account, project, goal, expectDuration, repo);

        expect(result).toBe(AddTaskResult.Success);
    });

    it("fail if there is duplicated task.", async () => {
        await addTask(account, project, goal, expectDuration, repo);
        const result = await addTask(account, project, goal, expectDuration, repo);

        expect(result).toBe(AddTaskResult.Duplicated);
    });

    it("fail if the expect duration is not positive.", async () => {
        const duration = 0;
        const result = await addTask(account, project, goal, duration, repo);
        expect(result).toBe(AddTaskResult.InvalidExpectDuration);
    });
});

describe("remove task", () => {
    it("success if there is such task.", async () => {
        await addTask(account, project, goal, expectDuration, repo);

        expect(removeTask(account, project, goal, repo)).resolves.toBe(undefined);
    });
});

describe("task-modify service", () => {
    beforeEach(async () => {
        await addTask(account, project, goal, expectDuration, repo);
    });

    describe("change expect duration", () => {
        it("success if the duration is a positive number.", async () => {
            const duration = 2;

            const result = await changeExpectDuration(account, project, goal, duration, repo);
            const task = await repo.getTask(account, project, goal);

            expect(result).toBe(ChangeExpectDurationResult.Success);
            expect(repo.save).toBeCalledTimes(1);
            expect(task.expectDuration).toBe(duration);
        });

        it("fail if the duration is not a positive number.", async () => {
            const duration = 0;

            const result = await changeExpectDuration(account, project, goal, duration, repo);
            const task = await repo.getTask(account, project, goal);

            expect(result).toBe(ChangeExpectDurationResult.InvalidDuration);
            expect(repo.save).not.toBeCalled();
            expect(task.expectDuration).toBe(expectDuration);
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
        it("success if the task is in running.", async () => {
            const startTime = new Date();
            const stopTime = new Date(startTime.getTime() + 1);

            await startTask(account, project, goal, startTime, repo);
            const result = await stopTask(account, project, goal, stopTime, repo);

            expect(result).toBe(StopTaskResult.Success);
            expect(repo.save).toBeCalledTimes(2);
        });

        it("fail if the task is not in running.", async () => {
            const stopTime = new Date();

            const result = await stopTask(account, project, goal, stopTime, repo);

            expect(result).toBe(StopTaskResult.NotInRunning);
            expect(repo.save).not.toBeCalled();
        });
    });
});