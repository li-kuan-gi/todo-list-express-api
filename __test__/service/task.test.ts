import {
    TaskRepository,
    ChangeExpectDurationResult,
    addTask,
    removeTask,
    changeExpectDuration,
    StartTaskResult,
    startTask,
    StopTaskResult,
    stopTask,
    AddTaskFailure
} from "../../src/service/task";
import { TestTaskStorage } from "./test-task-storage";

let id: string;
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

        expect(typeof result).toBe("string");
    });

    it("fail if there is duplicated task.", async () => {
        await addTask(account, project, goal, 1, repo);
        const result = await addTask(account, project, goal, 2, repo);

        expect(result).toBe(AddTaskFailure.Duplicated);
    });

    it("fail if the expect duration is not positive.", async () => {
        const duration = 0;
        const result = await addTask(account, project, goal, duration, repo);
        expect(result).toBe(AddTaskFailure.InvalidExpectDuration);
    });
});

describe("remove task", () => {
    it("success if there is such task.", async () => {
        const id = await addTask(account, project, goal, expectDuration, repo) as string;

        expect(removeTask(id, repo)).resolves.toBe(undefined);
    });
});

describe("task-modify service", () => {
    beforeEach(async () => {
        id = await addTask(account, project, goal, expectDuration, repo) as string;
    });

    describe("change expect duration", () => {
        it("success if the duration is a positive number.", async () => {
            const duration = 2;

            const result = await changeExpectDuration(id, duration, repo);
            const task = await repo.getTaskByID(id);

            expect(result).toBe(ChangeExpectDurationResult.Success);
            expect(repo.save).toBeCalledTimes(1);
            expect(task.expectDuration).toBe(duration);
        });

        it("fail if the duration is not a positive number.", async () => {
            const duration = 0;

            const result = await changeExpectDuration(id, duration, repo);
            const task = await repo.getTaskByID(id);

            expect(result).toBe(ChangeExpectDurationResult.InvalidDuration);
            expect(repo.save).not.toBeCalled();
            expect(task.expectDuration).toBe(expectDuration);
        });
    });

    describe("start task", () => {
        it("success if the task has not yet been started.", async () => {
            const time: Date = new Date();

            const result = await startTask(id, time, repo);

            expect(result).toBe(StartTaskResult.Success);
            expect(repo.save).toBeCalledTimes(1);
        });

        it("fail if the task has been started.", async () => {
            const time: Date = new Date();
            startTask(id, time, repo);

            const result = await startTask(id, time, repo);

            expect(result).toBe(StartTaskResult.HasStarted);
            expect(repo.save).toBeCalledTimes(1);
        });
    });

    describe("stop task", () => {
        it("success if the task is in running.", async () => {
            const startTime = new Date();
            const stopTime = new Date(startTime.getTime() + 1);

            await startTask(id, startTime, repo);
            const result = await stopTask(id, stopTime, repo);

            expect(result).toBe(StopTaskResult.Success);
            expect(repo.save).toBeCalledTimes(2);
        });

        it("fail if the task is not in running.", async () => {
            const stopTime = new Date();

            const result = await stopTask(id, stopTime, repo);

            expect(result).toBe(StopTaskResult.NotInRunning);
            expect(repo.save).not.toBeCalled();
        });
    });
});