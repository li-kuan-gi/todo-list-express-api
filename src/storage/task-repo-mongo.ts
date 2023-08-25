import { Db, MongoServerError, ObjectId } from "mongodb";
import { Task } from "../entity/task";
import { TaskNotFound, TaskRepository } from "../service/task";
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

    async getTaskByID(id: string): Promise<Task> {
        const taskData = await this.db.collection(this.collName).findOne({ _id: new ObjectId(id) });

        if (!taskData) throw new TaskNotFound();

        const task = new Task(
            taskData.account,
            taskData.project,
            taskData.goal,
            taskData.expectDuration,
            taskData._id.toString()
        );
        (task as any)._startTime = taskData.startTime || undefined;
        (task as any)._completeTime = taskData.completeTime || undefined;
        (task as any)._stopTimes = taskData.stopTimes;
        (task as any)._resumeTimes = taskData.resumeTimes;

        return task;
    }

    async add(task: Task): Promise<string | undefined> {
        try {
            const result = await this.db.collection(this.collName).insertOne({
                account: task.account,
                project: task.project,
                goal: task.goal,
                expectDuration: task.expectDuration,
                startTime: task.startTime,
                completeTime: task.completeTime,
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

    async remove(id: string): Promise<void> {
        const result = await this.db.collection(this.collName).deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            throw new TaskNotFound();
        }
    }

    save(task: Task): Promise<void> {
        throw new Error("Method not implemented.");
    }
}