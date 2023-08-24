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
): Promise<string | AddTaskFailure> {
    if (expectTime <= 0) {
        return AddTaskFailure.InvalidExpectDuration;
    }
    const task = new Task(account, project, goal, expectTime);
    const id = await repo.add(task);
    return id || AddTaskFailure.Duplicated;
}

export async function removeTask(
    id: string,
    repo: TaskRepository
): Promise<void> {
    await repo.remove(id);
}

export async function changeExpectDuration(
    id: string,
    duration: number,
    repo: TaskRepository
): Promise<ChangeExpectDurationResult> {
    if (duration <= 0) {
        return ChangeExpectDurationResult.InvalidDuration;
    } else {
        const task = await repo.getTaskByID(id);
        task.expect(duration);
        await repo.save(task);
        return ChangeExpectDurationResult.Success;
    }
}

export async function startTask(
    id: string,
    time: Date,
    repo: TaskRepository
): Promise<StartTaskResult> {
    const task = await repo.getTaskByID(id);

    const result = task.start(time);

    if (result) {
        await repo.save(task);
        return StartTaskResult.Success;
    } else {
        return StartTaskResult.HasStarted;
    }
};

export async function stopTask(
    id: string,
    time: Date,
    repo: TaskRepository
): Promise<StopTaskResult> {
    const task = await repo.getTaskByID(id);

    const result = task.stop(time);

    if (result) {
        await repo.save(task);
        return StopTaskResult.Success;
    } else {
        return StopTaskResult.NotInRunning;
    }
}

export async function resumeTask(
    id: string,
    time: Date,
    repo: TaskRepository
): Promise<ResumeTaskResult> {
    const task = await repo.getTaskByID(id);
    const result = task.resume(time);
    if (result) {
        await repo.save(task);
        return ResumeTaskResult.Success;
    } else {
        return ResumeTaskResult.NotStopped;
    }
}

export async function completeTask(
    id: string,
    time: Date,
    repo: TaskRepository
): Promise<CompleteTaskResult> {
    const task = await repo.getTaskByID(id);
    const result = task.complete(time);
    if (result) {
        await repo.save(task);
        return CompleteTaskResult.Success;
    } else {
        return CompleteTaskResult.NotInRunning;
    }
}

export interface TaskRepository {
    getTask(account: string, project: string, goal: string): Promise<Task | undefined>;
    getTaskByID(id: string): Promise<Task>;
    add(task: Task): Promise<string | undefined>;
    remove(id: string): Promise<void>;
    save(task: Task): Promise<void>;
}

export class TaskNotFound { }

export enum AddTaskFailure {
    Duplicated, InvalidExpectDuration
}

export enum ChangeExpectDurationResult {
    Success, InvalidDuration
}

export enum StartTaskResult {
    Success, HasStarted
}

export enum StopTaskResult {
    Success, NotInRunning
}

export enum ResumeTaskResult {
    Success, NotStopped
}

export enum CompleteTaskResult {
    Success, NotInRunning
}