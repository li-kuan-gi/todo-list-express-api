import { getApp } from "./app";
import { config } from "./config";
import { connectMongo } from "./mongodb-client";

const port = config.apiPort;

(async () => {
    await connectMongo();
    const app = getApp();
    app.listen(port, () => {
        console.log(`todo list api listening to port ${port}`);
    });
})();