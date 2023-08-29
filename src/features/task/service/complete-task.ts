import { TaskRepository } from "./repository";

export class CompleteTask {
    private readonly repo;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(id: string, time: Date): Promise<CompleteTaskResult> {
        const task = await this.repo.getTaskByID(id);
        const result = task.complete(time);
        if (result) {
            await this.repo.save(task);
            return CompleteTaskResult.Success;
        } else {
            return CompleteTaskResult.NotInRunning;
        }
    }
}

export enum CompleteTaskResult {
    Success, NotInRunning
}