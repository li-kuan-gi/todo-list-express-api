import { TaskRepository } from "./repository";

export class StartTask {
    private readonly repo;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(id: string, time: Date): Promise<StartTaskResult> {
        const task = await this.repo.getTaskByID(id);

        const result = task.start(time);

        if (result) {
            await this.repo.save(task);
            return StartTaskResult.Success;
        } else {
            return StartTaskResult.HasStarted;
        }
    }
}

export enum StartTaskResult {
    Success, HasStarted
}