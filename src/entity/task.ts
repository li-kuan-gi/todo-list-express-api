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