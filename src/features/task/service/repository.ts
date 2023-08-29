import { Task } from "@task/domain";

export interface TaskRepository {
    getTaskByID(id: string): Promise<Task>;
    add(task: Task): Promise<string | undefined>;
    remove(id: string): Promise<void>;
    save(task: Task): Promise<void>;
}