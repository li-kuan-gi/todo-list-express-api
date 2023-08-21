import { TaskRepository } from "../../src/service/task";

export class TestTaskStorage implements TaskRepository {
    private readonly tasks: Task[] = [];

    async add(account: string, project: string, goal: string, expectTime: number): Promise<boolean> {
        const task = this.tasks.find(task => task.account === account && task.project === project && task.goal === goal);

        if (!task) {
            this.tasks.push(new Task(account, project, goal, expectTime));
        }

        return !task;
    }
}

class Task {
    account: string;
    project: string;
    goal: string;
    expectTime: number;

    constructor(account: string, project: string, goal: string, expectTime: number) {
        this.account = account;
        this.project = project;
        this.goal = goal;
        this.expectTime = expectTime;
    }
}