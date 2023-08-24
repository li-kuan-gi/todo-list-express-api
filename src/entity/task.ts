export class Task {
    private _account: string;
    private _project: string;
    private _goal: string;
    private _expectDuration: number;
    private _startTime?: Date;
    private _stopTimes: Date[] = [];

    /**
     * 
     * @param account 
     * @param project 
     * @param goal 
     * @param expectDuration - should be positive, unit is minute.
     */
    constructor(account: string, project: string, goal: string, expectDuration: number) {
        if (expectDuration <= 0) {
            throw new Error("expect time should be a positive number.");
        }
        this._account = account;
        this._project = project;
        this._goal = goal;
        this._expectDuration = expectDuration;
    }

    get account(): string {
        return this._account;
    }

    get project(): string {
        return this._project;
    }

    get goal(): string {
        return this._goal;
    }

    get expectDuration(): number {
        return this._expectDuration;
    }

    isTheSameAs(task: Task): boolean {
        return this._account === task._account && this._project === task._project && this._goal === task._goal;
    }

    /**
     * 
     * @param time - the unit is "minute", e.g. for time=3, it means "expect 3 minute"
     * @returns 
     */
    expect(time: number): boolean {
        if (time <= 0) {
            return false;
        } else {
            this._expectDuration = time;
            return true;
        }
    }

    start(time: Date): boolean {
        if (!this._startTime) {
            this._startTime = time;
            return true;
        } else {
            return false;
        }
    }

    stop(time: Date): boolean {
        if (!this._startTime || time <= this._startTime) {
            return false;
        } else {
            this._stopTimes.push(time);
            return true;
        }
    }
}