import { NotAllowed } from "./not-allowed";
import { TaskRepository } from "./repository";

export class ResumeTask implements IResumeTask {
    private readonly repo;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(account: string, id: string, time: Date): Promise<ResumeTaskResult> {
        const task = await this.repo.getTaskByID(id);

        if (task.account !== account) throw new NotAllowed();

        const result = task.resume(time);
        if (result) {
            await this.repo.save(task);
            return ResumeTaskResult.Success;
        } else {
            return ResumeTaskResult.NotStopped;
        }
    }
}

export interface IResumeTask {
    execute(account: string, id: string, time: Date): Promise<ResumeTaskResult>;
}

export enum ResumeTaskResult {
    Success, NotStopped
}