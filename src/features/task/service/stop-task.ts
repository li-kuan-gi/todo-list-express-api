import { NotAllowed } from "./not-allowed";
import { TaskRepository } from "./repository";

export class StopTask implements IStopTask {
    private readonly repo;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(account: string, id: string, time: Date): Promise<StopTaskResult> {
        const task = await this.repo.getTaskByID(id);

        if (task.account !== account) throw new NotAllowed();

        const result = task.stop(time);

        if (result) {
            await this.repo.save(task);
            return StopTaskResult.Success;
        } else {
            return StopTaskResult.NotInRunning;
        }
    }
}

export interface IStopTask {
    execute(account: string, id: string, time: Date): Promise<StopTaskResult>;
}

export enum StopTaskResult {
    Success, NotInRunning
}