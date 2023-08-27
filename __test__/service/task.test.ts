import {
    TaskRepository,
    ChangeExpectDurationResult,
    StartTaskResult,
    StopTaskResult,
    AddTaskFailure,
    ResumeTaskResult,
    CompleteTaskResult,
    AddTask,
    RemoveTask,
    ChangeExpectDuration,
    StartTask,
    StopTask,
    ResumeTask,
    CompleteTask
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
    let addTask: AddTask;

    beforeEach(() => {
        addTask = new AddTask(repo);
    });

    it("success if no same task.", async () => {
        const result = await addTask.execute(account, project, goal, expectDuration);

        expect(typeof result).toBe("string");
    });

    it("fail if there is duplicated task.", async () => {
        await addTask.execute(account, project, goal, 1);

        const result = await addTask.execute(account, project, goal, 2);

        expect(result).toBe(AddTaskFailure.Duplicated);
    });

    it("fail if the expect duration is not positive.", async () => {
        const duration = 0;

        const result = await addTask.execute(account, project, goal, duration);

        expect(result).toBe(AddTaskFailure.InvalidExpectDuration);
    });
});

describe("remove task", () => {
    it("success if there is such task.", async () => {
        const addTask = new AddTask(repo);
        const id = await addTask.execute(account, project, goal, expectDuration) as string;

        const removeTask = new RemoveTask(repo);
        expect(removeTask.execute(id)).resolves.toBe(undefined);
    });
});

describe("task-modify service", () => {
    beforeEach(async () => {
        const addTask = new AddTask(repo);
        id = await addTask.execute(account, project, goal, expectDuration) as string;
    });

    describe("change expect duration", () => {
        let changeExpectDuration: ChangeExpectDuration;

        beforeEach(() => {
            changeExpectDuration = new ChangeExpectDuration(repo);
        });

        it("success if the duration is a positive number.", async () => {
            const duration = 2;

            const result = await changeExpectDuration.execute(id, duration);
            const task = await repo.getTaskByID(id);

            expect(result).toBe(ChangeExpectDurationResult.Success);
            expect(repo.save).toBeCalledTimes(1);
            expect(task.expectDuration).toBe(duration);
        });

        it("fail if the duration is not a positive number.", async () => {
            const duration = 0;

            const result = await changeExpectDuration.execute(id, duration);
            const task = await repo.getTaskByID(id);

            expect(result).toBe(ChangeExpectDurationResult.InvalidDuration);
            expect(repo.save).not.toBeCalled();
            expect(task.expectDuration).toBe(expectDuration);
        });
    });

    describe("start task", () => {
        let startTask: StartTask;

        beforeEach(() => {
            startTask = new StartTask(repo);
        });

        it("success if the task has not yet been started.", async () => {
            const time: Date = new Date();

            const result = await startTask.execute(id, time);

            expect(result).toBe(StartTaskResult.Success);
            expect(repo.save).toBeCalledTimes(1);
        });

        it("fail if the task has been started.", async () => {
            const time: Date = new Date();
            startTask.execute(id, time);

            const result = await startTask.execute(id, time);

            expect(result).toBe(StartTaskResult.HasStarted);
            expect(repo.save).toBeCalledTimes(1);
        });
    });

    describe("stop task", () => {
        let startTask: StartTask;
        let stopTask: StopTask;

        beforeEach(() => {
            startTask = new StartTask(repo);
            stopTask = new StopTask(repo);
        });

        it("success if the task is in running.", async () => {
            const startTime = new Date();
            const stopTime = new Date(startTime.getTime() + 1);

            await startTask.execute(id, startTime);
            const result = await stopTask.execute(id, stopTime);

            expect(result).toBe(StopTaskResult.Success);
            expect(repo.save).toBeCalledTimes(2);
        });

        it("fail if the task is not in running.", async () => {
            const stopTime = new Date();

            const result = await stopTask.execute(id, stopTime);

            expect(result).toBe(StopTaskResult.NotInRunning);
            expect(repo.save).not.toBeCalled();
        });
    });

    describe("resume task", () => {
        let startTask: StartTask;
        let stopTask: StopTask;
        let resumeTask: ResumeTask;

        beforeEach(() => {
            startTask = new StartTask(repo);
            stopTask = new StopTask(repo);
            resumeTask = new ResumeTask(repo);
        });

        it("success if the task is stopped.", async () => {
            const startTime = new Date();
            const stopTime = new Date(startTime.getTime() + 1);
            const resumeTime = new Date(startTime.getTime() + 2);

            await startTask.execute(id, startTime);
            await stopTask.execute(id, stopTime);
            const result = await resumeTask.execute(id, resumeTime);

            expect(result).toBe(ResumeTaskResult.Success);
            expect(repo.save).toBeCalledTimes(3);
        });

        it("fail if the task is not stopped.", async () => {
            const startTime = new Date();
            const resumeTime = new Date(startTime.getTime() + 2);

            await startTask.execute(id, startTime);
            const result = await resumeTask.execute(id, resumeTime);

            expect(result).toBe(ResumeTaskResult.NotStopped);
            expect(repo.save).toBeCalledTimes(1);
        });
    });

    describe("complete task", () => {
        let startTask: StartTask;
        let completeTask: CompleteTask;

        beforeEach(() => {
            startTask = new StartTask(repo);
            completeTask = new CompleteTask(repo);
        });

        it("success if the task is in running.", async () => {
            const startTime = new Date();
            const time = new Date(startTime.getTime() + 1);

            await startTask.execute(id, startTime);
            const result = await completeTask.execute(id, time);

            expect(result).toBe(CompleteTaskResult.Success);
            expect(repo.save).toBeCalledTimes(2);
        });

        it("fail if the task is not in running.", async () => {
            const time = new Date();

            const result = await completeTask.execute(id, time);

            expect(result).toBe(CompleteTaskResult.NotInRunning);
            expect(repo.save).not.toBeCalled();
        });
    });
});