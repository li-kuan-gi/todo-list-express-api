import { App } from "./app";
import { config } from "./config";

const port = 3001;

(async () => {
    const app = new App(config);
    await app.setup();
    app.listen(port, () => {
        console.log(`todo list api listening to port ${port}`);
    });
})();