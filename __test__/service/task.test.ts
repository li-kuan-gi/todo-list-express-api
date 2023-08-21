import { TaskRepository, addTask } from "../../src/service/task";
import { TestTaskStorage } from "./test-task-storage";

let storage: TestTaskStorage;

beforeEach(() => {
    storage = new TestTaskStorage();
});

describe("addTask", () => {
    it("success if no same task.", async () => {
        const account = "test account";
        const project = "test project";
        const goal = "test goal";
        const expectTime = 35;
        const repo: TaskRepository = storage;

        const result = await addTask(account, project, goal, expectTime, repo);

        expect(result).toBeTruthy();
    });

    it("fail if there is duplicated task.", async () => {
        const account = "test account";
        const project = "test project";
        const goal = "test goal";
        const expectTime = 35;
        const repo: TaskRepository = storage;

        await addTask(account, project, goal, expectTime, repo);
        const result = await addTask(account, project, goal, expectTime, repo);

        expect(result).toBeFalsy();
    });
});
