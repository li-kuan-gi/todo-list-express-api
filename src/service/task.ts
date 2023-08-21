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

export interface TaskRepository {
    add(account: string, project: string, goal: string, expectTime: number): Promise<boolean>;
}