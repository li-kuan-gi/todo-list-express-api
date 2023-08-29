import { TaskRepository } from "./repository";

export class ChangeExpectDuration {
    private readonly repo: TaskRepository;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(id: string, duration: number): Promise<ChangeExpectDurationResult> {
        if (duration <= 0) {
            return ChangeExpectDurationResult.InvalidDuration;
        } else {
            const task = await this.repo.getTaskByID(id);
            task.expect(duration);
            await this.repo.save(task);
            return ChangeExpectDurationResult.Success;
        }
    }
}

export enum ChangeExpectDurationResult {
    Success, InvalidDuration
}