import { NotAllowed } from "./not-allowed";
import { TaskRepository } from "./repository";

export class RemoveTask implements IRemoveTask {
    private readonly repo: TaskRepository;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(id: string, account: string): Promise<void> {
        const task = await this.repo.getTaskByID(id);
        if (task.account !== account) {
            throw new NotAllowed();
        }
        await this.repo.remove(id);
    }
}

export interface IRemoveTask {
    execute: (id: string, account: string) => Promise<void>;
}