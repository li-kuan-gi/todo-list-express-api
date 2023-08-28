import { Collection, Db } from "mongodb";
import { TaskInfo, TaskView } from "../service/task";
import { config } from "../config";

export class TaskViewMongo implements TaskView {
    private coll: Collection;

    constructor(db: Db) {
        this.coll = db.collection(config.taskCollName);
    }

    async list(): Promise<TaskInfo[]> {
        const taskData = await this.coll.find().toArray();
        return taskData.map<TaskInfo>(data => ({
            tid: data._id.toString(),
            account: data.account,
            project: data.project,
            goal: data.goal,
            expectDuration: data.expectDuration,
            stopTimes: data.stopTimes,
            resumeTimes: data.resumeTimes,
            startTime: data.startTime || undefined,
            completeTime: data.completeTime || undefined
        }));
    }
}