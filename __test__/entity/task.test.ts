import { Task } from "../../src/entity/task";

let task: Task;

beforeEach(() => {
    task = new Task("account", "project", "goal", 1);
});

describe("task", () => {
    describe("initialization", () => {
        it("expect duration should be positive.", () => {
            const expectDuration = 0;

            expect(() => new Task("a", "b", "c", expectDuration)).toThrow();
        });
    });

    describe("expect", () => {
        it("return true if the duration is positive", () => {
            const duration = 2;

            const result = task.expect(duration);

            expect(result).toBeTruthy();
        });

        it("return false if the duration is not positive", () => {
            const duration = 0;
            const result = task.expect(duration);
            expect(result).toBeFalsy();
        });
    });

    describe("start", () => {
        it("return true if the task has not been started.", () => {
            const time = new Date();
            const result = task.start(time);
            expect(result).toBeTruthy();
        });

        it("return false if the task has been started.", () => {
            const time = new Date();
            task.start(time);
            const result = task.start(time);
            expect(result).toBeFalsy();
        });
    });

    describe("stop", () => {
        describe("success if the task is in running", () => {
            it("e.g. after starting time.", () => {
                const startTime = new Date();
                const stopTime = new Date(startTime.getTime() + 1);

                task.start(startTime);
                const result = task.stop(stopTime);

                expect(result).toBeTruthy();
            });

            it("e.g. after resuming task", () => {
                const startTime = new Date();
                const firstStopTime = new Date(startTime.getTime() + 1);
                const resumeTime = new Date(startTime.getTime() + 2);
                const time = new Date(startTime.getTime() + 3);

                task.start(startTime);
                task.stop(firstStopTime);
                task.resume(resumeTime);
                const resutlt = task.stop(time);

                expect(resutlt).toBeTruthy();
            });
        });

        describe("fail if the task is not in running.", () => {
            it("e.g. the task has not been started.", () => {
                const stopTime = new Date();

                const result = task.stop(stopTime);

                expect(result).toBeFalsy();
            });

            it("e.g. consecutively stop a task.", () => {
                const startTime = new Date();
                const stopTime = new Date(startTime.getTime() + 1);

                task.start(startTime);
                task.stop(stopTime);
                const result = task.stop(stopTime);

                expect(result).toBeFalsy();
            });
        });
    });

    describe("resume", () => {
        describe("success if the task is stopped", () => {
            it("e.g. after stopping task", () => {
                const startTime = new Date();
                const stopTime = new Date(startTime.getTime() + 1);
                const time = new Date(startTime.getTime() + 2);

                task.start(startTime);
                task.stop(stopTime);
                const result = task.resume(time);

                expect(result).toBeTruthy();
            });
        });

        describe("fail if the task is not stopped", () => {
            it("e.g. after starting task", () => {
                const startTime = new Date();
                const time = new Date(startTime.getTime() + 1);

                task.start(startTime);
                const result = task.resume(time);

                expect(result).toBeFalsy();
            });

            it("e.g. consecutively resume a task", () => {
                const startTime = new Date();
                const stopTime = new Date(startTime.getTime() + 1);
                const firstResumeTime = new Date(startTime.getTime() + 2);
                const time = new Date(startTime.getTime() + 3);

                task.start(startTime);
                task.stop(stopTime);
                task.resume(firstResumeTime);
                const result = task.resume(time);

                expect(result).toBeFalsy();
            });
        });
    });
});