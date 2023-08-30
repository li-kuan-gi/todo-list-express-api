import { App } from "./app";
import { apiPort, config } from "./config";

(async () => {
    const app = new App(config);
    await app.setup();
    const port = apiPort;
    app.listen(port, () => {
        console.log(`todo list api listening to port ${port}`);
    });
})();