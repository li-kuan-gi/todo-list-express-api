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
    return await repo.add(account, project, goal, expectTime);
}

export async function removeTask(account: string, project: string, goal: string, repo: TaskRepository) {
    const task = new Task(account, project, goal, 0);

    return await repo.remove(task);
}

export interface TaskRepository {
    add(account: string, project: string, goal: string, expectTime: number): Promise<boolean>;
    remove(task: Task): Promise<boolean>;
}

export class Task {
    account: string;
    project: string;
    goal: string;
    expectTime: number;

    constructor(account: string, project: string, goal: string, expectTime: number) {
        this.account = account;
        this.project = project;
        this.goal = goal;
        this.expectTime = expectTime;
    }

    isTheSameAs(task: Task): boolean {
        return this.account === task.account && this.project === task.project && this.goal === task.goal;
    }
}