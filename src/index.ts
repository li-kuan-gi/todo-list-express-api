import { app } from "./app";
import { config } from "./config";

const port = config.apiPort;

app.listen(port, () => {
    console.log(`todo list api listening to port ${port}`);
});