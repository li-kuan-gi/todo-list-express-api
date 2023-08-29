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