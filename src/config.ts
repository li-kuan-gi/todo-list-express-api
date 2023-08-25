export const config = {
    mongodbUri: process.env.MONGODB_URI,
    dbName: "todo-list",
    userCollName: "user",
    taskCollName: "task",
    apiPort: 3001,
    jwtSecret: "jwt-secret-example"
};