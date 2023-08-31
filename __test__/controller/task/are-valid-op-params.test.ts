import { areValidOpParams } from "@controller/task/are-valid-op-params";

describe("\"areValidOpParams\"", () => {
    let timeString: any;

    beforeEach(() => {
        timeString = new Date().toISOString();
    });
    it("return true if all params are valid.", () => {
        expect(areValidOpParams("id", "acc", timeString)).toBeTruthy();
    });

    it("return false if id not a string.", () => {
        expect(areValidOpParams(1, "acc", timeString)).toBeFalsy();
    });

    it("return false if account not a string.", () => {
        expect(areValidOpParams("id", 1, timeString)).toBeFalsy();
    });

    it("return false if timeString not a string.", () => {
        expect(areValidOpParams("id", "acc", 0)).toBeFalsy();
    });

    it("return false if the timeString is not a valid date string.", () => {
        expect(areValidOpParams("id", "acc", "")).toBeFalsy();
    });
});