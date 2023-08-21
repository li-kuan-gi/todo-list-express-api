import { Task, TaskRepository } from "../../src/service/task";

export class TestTaskStorage implements TaskRepository {
    private readonly tasks: Task[] = [];

    async add(account: string, project: string, goal: string, expectTime: number): Promise<boolean> {
        const task = this.tasks.find(task => task.account === account && task.project === project && task.goal === goal);

        if (!task) {
            this.tasks.push(new Task(account, project, goal, expectTime));
        }

        return !task;
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
}
