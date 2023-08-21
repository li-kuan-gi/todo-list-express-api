import { TaskRepository, addTask, removeTask } from "../../src/service/task";
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

describe("remove task", () => {
    it("success if there is such task.", async () => {
        const account = "test account";
        const project = "test project";
        const goal = "test goal";
        const expectTime = 35;
        const repo: TaskRepository = storage;
        await addTask(account, project, goal, expectTime, repo);

        const result = await removeTask(account, project, goal, repo);

        expect(result).toBeTruthy();
    });

    it("fail if there is no such task.", async () => {
        const account = "test account";
        const project = "test project";
        const goal = "test goal";
        const repo: TaskRepository = storage;

        const result = await removeTask(account, project, goal, repo);

        expect(result).toBeFalsy();
    });
});