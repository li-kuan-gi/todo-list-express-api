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
): Promise<AddTaskResult> {
    const task = new Task(account, project, goal, expectTime);

    const result = await repo.add(task);

    return result ? AddTaskResult.Success : AddTaskResult.Duplicated;
}

export async function removeTask(
    account: string,
    project: string,
    goal: string,
    repo: TaskRepository
): Promise<void> {
    const task = new Task(account, project, goal, 1);

    await repo.remove(task);
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
        await repo.updateExpectTime(task, time);
        return SetExpectTimeResult.Success;
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

    if (task.startTime) {
        return StartTaskResult.HasStarted;
    } else {
        task.startTime = time;
        return StartTaskResult.Success;
    }
};

export interface TaskRepository {
    getTask(account: string, project: string, goal: string): Promise<Task>;
    add(task: Task): Promise<boolean>;
    remove(task: Task): Promise<void>;
    updateExpectTime(task: Task, time: number): Promise<void>;
    setStartTime(task: Task, time: Date): Promise<void>;
}

export class TaskNotFound { }

export enum AddTaskResult {
    Success, Duplicated
}

export enum SetExpectTimeResult {
    Success, InvalidPeriod
}

export enum StartTaskResult {
    Success, HasStarted
}