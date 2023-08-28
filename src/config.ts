import { AppConfig } from "./app";

export const config: AppConfig = {
    mongodbUri: process.env.MONGODB_URI as string,
    dbName: "todo-list",
    userCollName: "user",
    taskCollName: "task",
    jwtSecret: "jwt-secret-example"
};