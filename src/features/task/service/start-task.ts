import { NotAllowed } from "./not-allowed";
import { TaskRepository } from "./repository";

export class StartTask implements IStartTask {
    private readonly repo;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(account: string, id: string, time: Date): Promise<StartTaskResult> {
        const task = await this.repo.getTaskByID(id);

        if (task.account !== account) throw new NotAllowed();

        const result = task.start(time);

        if (result) {
            await this.repo.save(task);
            return StartTaskResult.Success;
        } else {
            return StartTaskResult.HasStarted;
        }
    }
}

export interface IStartTask {
    execute(account: string, id: string, time: Date): Promise<StartTaskResult>;
}

export enum StartTaskResult {
    Success, HasStarted
}