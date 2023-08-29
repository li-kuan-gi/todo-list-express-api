import { Task } from "@task/domain";
import { TaskRepository } from "@task/service";
import { TaskNotFound } from "@task/storage";

export class TestTaskStorage implements TaskRepository {
    private readonly tasks: Task[] = [];

    async getTask(account: string, project: string, goal: string): Promise<Task | undefined> {
        const task = new Task(account, project, goal, 1);
        return this.tasks.find(t => t.isTheSameAs(task));
    }

    async getTaskByID(id: string): Promise<Task> {
        const result = this.tasks.find(t => t.tid === id);
        if (!result) {
            throw new TaskNotFound();
        } else {
            return result;
        }
    }

    async add(task: Task): Promise<string | undefined> {
        const result = this.tasks.find(t => t.isTheSameAs(task));

        if (!result) {
            const id = `${this.tasks.length}`;
            (task as any).tid = id;
            this.tasks.push(task);
            return id;
        } else {
            return;
        }
    }

    async remove(id: string): Promise<void> {
        const result = this.tasks.findIndex(t => t.tid === id);

        if (result === -1) {
            throw new TaskNotFound();
        } else {
            this.tasks.splice(result, 1);
        }
    }

    save: (task: Task) => Promise<void> = jest.fn();
}