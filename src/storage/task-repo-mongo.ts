import { Db, MongoServerError } from "mongodb";
import { Task } from "../entity/task";
import { TaskRepository } from "../service/task";
import { config } from "../config";

export class TaskRepoMongo implements TaskRepository {
    private readonly db: Db;
    private readonly collName = config.taskCollName;

    constructor(db: Db) {
        this.db = db;
    }

    getTask(account: string, project: string, goal: string): Promise<Task | undefined> {
        throw new Error("Method not implemented.");
    }
    getTaskByID(id: string): Promise<Task> {
        throw new Error("Method not implemented.");
    }
    async add(task: Task): Promise<string | undefined> {
        try {
            const result = await this.db.collection(this.collName).insertOne({
                account: task.account,
                project: task.project,
                goal: task.goal,
                expectDuration: task.expectDuration,
                startTime: task.startTime?.toISOString(),
                completeTime: task.completeTime?.toISOString(),
                stopTimes: task.stopTimes,
                resumeTimes: task.resumeTimes
            });
            return result.insertedId.toString();
        } catch (error) {
            if (error instanceof MongoServerError && error.message.includes("duplicate")) {
                return;
            } else {
                throw error;
            }
        }
    }
    remove(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    save(task: Task): Promise<void> {
        throw new Error("Method not implemented.");
    }
}