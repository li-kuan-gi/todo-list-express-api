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
    const task = new Task(account, project, goal, 1);

    return await repo.remove(task);
}

export async function setExpectTime(
    account: string,
    project: string,
    goal: string,
    time: number,
    repo: TaskRepository
): Promise<SetExpectTimeResult> {
    if (time <= 0) {
        return SetExpectTimeResult.InvalidPeriod;
    } else {
        const task = new Task(account, project, goal, 1);
        const result = await repo.updateExpectTime(task, time);

        if (!result) {
            return SetExpectTimeResult.NotFound;
        } else {
            return SetExpectTimeResult.Success;
        }
    }
}

export async function startTask(
    account: string,
    project: string,
    goal: string,
    time: Date,
    repo: TaskRepository
): Promise<StartTaskResult> {
    const task = await repo.getTask(account, project, goal);

    if (!task) {
        return StartTaskResult.NotFound;
    } else if (task.startTime) {
        return StartTaskResult.HasStarted;
    } else {
        task.startTime = time;
        return StartTaskResult.Success;
    }
};

export interface TaskRepository {
    getTask(account: string, project: string, goal: string): Promise<Task | undefined>;
    add(task: Task): Promise<boolean>;
    remove(task: Task): Promise<boolean>;
    updateExpectTime(task: Task, time: number): Promise<boolean>;
    setStartTime(task: Task, time: Date): Promise<boolean>;
}

export enum SetExpectTimeResult {
    Success, NotFound, InvalidPeriod
}

export enum StartTaskResult {
    Success, NotFound, HasStarted
}