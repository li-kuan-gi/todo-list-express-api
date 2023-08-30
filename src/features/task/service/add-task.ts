import { Task } from "@task/domain";
import { TaskRepository } from "./repository";

export class AddTask {
    private readonly repo: TaskRepository;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    /**
     * 
     * @param account 
     * @param project 
     * @param goal 
     * @param duration - the unit is "minute", e.g. for duration=3, it means "expect 3 minute" 
     * @returns 
     */
    async execute(
        account: string,
        project: string,
        goal: string,
        duration: number
    ): Promise<string | AddTaskFailure> {
        if (duration <= 0) {
            return AddTaskFailure.InvalidExpectDuration;
        }
        const task = new Task(account, project, goal, duration);
        const id = await this.repo.add(task);
        return id || AddTaskFailure.Duplicated;
    }
}

export interface IAddTask {
    execute(
        account: string,
        project: string,
        goal: string,
        duration: number
    ): Promise<string | AddTaskFailure>;
}

export enum AddTaskFailure {
    Duplicated, InvalidExpectDuration
}