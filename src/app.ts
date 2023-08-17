import express from "express";
import { signup } from "./service/auth";
import { getMongoClient } from "./mongodb-client";
import { AuthRepoMongo } from "./storage/auth-repo-mongo";
import { config } from "./config";

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const account = req.body.account as string;
    const password = req.body.password as string;

    const client = await getMongoClient();
    const repo = new AuthRepoMongo(client.db(config.dbName));

    const result = await signup(account, password, repo);

    if (result) {
        res.status(200).json({});
    } else {
        res.status(409).json({ msg: "The account has already existed." });
    }
});

export { app };