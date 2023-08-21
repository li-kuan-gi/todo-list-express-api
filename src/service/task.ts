import { Task } from "../entity/task";

/**
 * 
 * @param account 
 * @param project 
 * @param goal 
 * @param expectTime - the unit is "minute", e.g. for expectTime=3, it means "expect 3 minute"
 * @param repo 
 * @returns 
 */
export async function addTask(
    account: string,
    project: string,
    goal: string,
    expectTime: number,
    repo: TaskRepository
): Promise<boolean> {
    const task = new Task(account, project, goal, expectTime);

    return await repo.add(task);
}

export async function removeTask(account: string, project: string, goal: string, repo: TaskRepository) {
    const task = new Task(account, project, goal, 0);

    return await repo.remove(task);
}

export interface TaskRepository {
    // add(account: string, project: string, goal: string, expectTime: number): Promise<boolean>;
    add(task: Task): Promise<boolean>;
    remove(task: Task): Promise<boolean>;
}