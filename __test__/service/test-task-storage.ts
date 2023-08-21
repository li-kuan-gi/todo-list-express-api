import { Task } from "../../src/entity/task";
import { TaskRepository } from "../../src/service/task";

export class TestTaskStorage implements TaskRepository {
    private readonly tasks: Task[] = [];

    async getTask(account: string, project: string, goal: string): Promise<Task | undefined> {
        const task = new Task(account, project, goal, 1);
        return this.tasks.find(t => t.isTheSameAs(task));
    }

    async add(task: Task): Promise<boolean> {
        const result = this.tasks.find(t => t.isTheSameAs(task));

        if (!result) {
            this.tasks.push(task);
        }

        return !result;
    }

    async remove(task: Task): Promise<boolean> {
        const result = this.tasks.findIndex(t => t.isTheSameAs(task));

        if (result === -1) {
            return false;
        } else {
            this.tasks.splice(result, 1);
            return true;
        }
    }

    async updateExpectTime(task: Task, time: number): Promise<boolean> {
        const result = this.tasks.find(t => t.isTheSameAs(task));

        if (!result) {
            return false;
        } else {
            result.expectTime = time;
            return true;
        }
    }

    async setStartTime(task: Task, time: Date): Promise<boolean> {
        const result = this.tasks.find(t => t.isTheSameAs(task));

        if (!result) {
            return false;
        } else {
            result.startTime = time;
            return true;
        }
    }
}
