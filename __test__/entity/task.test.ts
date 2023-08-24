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
            it("e.g. stop time is after start time.", () => {
                const startTime = new Date();
                const stopTime = new Date(startTime.getTime() + 1);

                task.start(startTime);
                const result = task.stop(stopTime);

                expect(result).toBeTruthy();
            });
        });

        describe("fail if the task is not in running.", () => {
            it("return false if the stop time is before start time.", () => {
                const startTime = new Date();
                const stopTime = new Date(startTime.getTime() - 1);

                task.start(startTime);
                const result = task.stop(stopTime);

                expect(result).toBeFalsy();
            });

            it("return false if the task has not been started.", () => {
                const stopTime = new Date();

                const result = task.stop(stopTime);

                expect(result).toBeFalsy();
            });

            it("return false if consecutively stop a task.", () => {
                const stopTime = new Date();

                task.stop(stopTime);
                const result = task.stop(stopTime);

                expect(result).toBeFalsy();
            });
        });
    });
});