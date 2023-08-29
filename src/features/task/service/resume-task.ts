import { TaskRepository } from "./repository";

export class ResumeTask {
    private readonly repo;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(id: string, time: Date): Promise<ResumeTaskResult> {
        const task = await this.repo.getTaskByID(id);
        const result = task.resume(time);
        if (result) {
            await this.repo.save(task);
            return ResumeTaskResult.Success;
        } else {
            return ResumeTaskResult.NotStopped;
        }
    }
}

export enum ResumeTaskResult {
    Success, NotStopped
}