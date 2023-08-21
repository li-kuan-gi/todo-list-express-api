import { Task } from "../../src/entity/task";

describe("task", () => {
    it("expect time should be positive.", () => {
        const expectTime = 0;

        expect(() => new Task("a", "b", "c", expectTime)).toThrow();
    });
});