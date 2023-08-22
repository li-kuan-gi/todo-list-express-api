import { Task } from "../../src/entity/task";
import { TaskNotFound, TaskRepository } from "../../src/service/task";

export class TestTaskStorage implements TaskRepository {
    private readonly tasks: Task[] = [];

    async getTask(account: string, project: string, goal: string): Promise<Task> {
        const task = new Task(account, project, goal, 1);
        const result = this.tasks.find(t => t.isTheSameAs(task));
        if (!result) {
            throw new TaskNotFound();
        } else {
            return result;
        }
    }

    async add(task: Task): Promise<boolean> {
        const result = this.tasks.find(t => t.isTheSameAs(task));

        if (!result) {
            this.tasks.push(task);
        }

        return !result;
    }

    async remove(task: Task): Promise<void> {
        const result = this.tasks.findIndex(t => t.isTheSameAs(task));

        if (result === -1) {
            throw new TaskNotFound();
        } else {
            this.tasks.splice(result, 1);
        }
    }

    save: (task: Task) => Promise<void> = jest.fn();
}