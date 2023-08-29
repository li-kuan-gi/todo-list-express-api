import { TaskRepository } from "./repository";

export class StopTask {
    private readonly repo;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(id: string, time: Date): Promise<StopTaskResult> {
        const task = await this.repo.getTaskByID(id);

        const result = task.stop(time);

        if (result) {
            await this.repo.save(task);
            return StopTaskResult.Success;
        } else {
            return StopTaskResult.NotInRunning;
        }
    }
}

export enum StopTaskResult {
    Success, NotInRunning
}