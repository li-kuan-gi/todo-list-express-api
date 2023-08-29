import { TaskRepository } from "./repository";

export class RemoveTask {
    private readonly repo: TaskRepository;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(id: string): Promise<void> {
        await this.repo.remove(id);
    }
}
