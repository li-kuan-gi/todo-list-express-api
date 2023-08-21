export class Task {
    account: string;
    project: string;
    goal: string;
    expectTime: number;
    startTime?: Date;
    private _stopTimes: Date[] = [];

    constructor(account: string, project: string, goal: string, expectTime: number) {
        if (expectTime <= 0) {
            throw new Error("expect time should be a positive number.");
        }
        this.account = account;
        this.project = project;
        this.goal = goal;
        this.expectTime = expectTime;
    }

    isTheSameAs(task: Task): boolean {
        return this.account === task.account && this.project === task.project && this.goal === task.goal;
    }

    stop(time: Date): boolean {
        if (!this.startTime) {
            return false;
        } else {
            this._stopTimes.push(time);
            return true;
        }
    }
}