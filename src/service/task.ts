import { Task } from "../entity/task";

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

export enum AddTaskFailure {
    Duplicated, InvalidExpectDuration
}

export class RemoveTask {
    private readonly repo: TaskRepository;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(id: string): Promise<void> {
        await this.repo.remove(id);
    }
}

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

export class StopTask {
    private readonly repo;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(id: string, time: Date): Promise<StopTaskResult> {
        const task = await this.repo.getTaskByID(id);

        const result = task.stop(time);

        if (result) {
            await this.repo.save(task);
            return StopTaskResult.Success;
        } else {
            return StopTaskResult.NotInRunning;
        }
    }
}

export enum StopTaskResult {
    Success, NotInRunning
}

export class ResumeTask {
    private readonly repo;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(id: string, time: Date): Promise<ResumeTaskResult> {
        const task = await this.repo.getTaskByID(id);
        const result = task.resume(time);
        if (result) {
            await this.repo.save(task);
            return ResumeTaskResult.Success;
        } else {
            return ResumeTaskResult.NotStopped;
        }
    }
}

export enum ResumeTaskResult {
    Success, NotStopped
}

export class CompleteTask {
    private readonly repo;

    constructor(repo: TaskRepository) {
        this.repo = repo;
    }

    async execute(id: string, time: Date): Promise<CompleteTaskResult> {
        const task = await this.repo.getTaskByID(id);
        const result = task.complete(time);
        if (result) {
            await this.repo.save(task);
            return CompleteTaskResult.Success;
        } else {
            return CompleteTaskResult.NotInRunning;
        }
    }
}

export enum CompleteTaskResult {
    Success, NotInRunning
}

export interface TaskRepository {
    getTaskByID(id: string): Promise<Task>;
    add(task: Task): Promise<string | undefined>;
    remove(id: string): Promise<void>;
    save(task: Task): Promise<void>;
}

export class TaskNotFound { }

export interface TaskView {
    list(): Promise<TaskInfo[]>;
}

export interface TaskInfo {
    tid: string;
    account: string;
    project: string;
    goal: string;
    expectDuration: number;
    startTime?: Date;
    completeTime?: Date;
    stopTimes: Date[];
    resumeTimes: Date[];
}