import { NotAllowed } from "./not-allowed";
import { TaskRepository } from "./repository";

export class ChangeExpectDuration implements IChangeExpectDuration {
    private readonly repo: TaskRepository;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(account: string, id: string, duration: number): Promise<ChangeExpectDurationResult> {
        if (duration <= 0) {
            return ChangeExpectDurationResult.InvalidDuration;
        } else {
            const task = await this.repo.getTaskByID(id);

            if (task.account !== account) throw new NotAllowed();

            task.expect(duration);
            await this.repo.save(task);
            return ChangeExpectDurationResult.Success;
        }
    }
}

export interface IChangeExpectDuration {
    execute(account: string, id: string, duration: number): Promise<ChangeExpectDurationResult>;
}

export enum ChangeExpectDurationResult {
    Success, InvalidDuration
}