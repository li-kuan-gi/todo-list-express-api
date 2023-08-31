import { NotAllowed } from "./not-allowed";
import { TaskRepository } from "./repository";

export class CompleteTask implements ICompleteTask {
    private readonly repo;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(account: string, id: string, time: Date): Promise<CompleteTaskResult> {
        const task = await this.repo.getTaskByID(id);

        if (task.account !== account) throw new NotAllowed();

        const result = task.complete(time);
        if (result) {
            await this.repo.save(task);
            return CompleteTaskResult.Success;
        } else {
            return CompleteTaskResult.NotInRunning;
        }
    }
}

export interface ICompleteTask {
    execute(account: string, id: string, time: Date): Promise<CompleteTaskResult>;
}

export enum CompleteTaskResult {
    Success, NotInRunning
}