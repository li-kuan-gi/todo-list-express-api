import express from "express";
import { sign as jwtSign } from "jsonwebtoken";
import { signup, validate } from "./service/auth";
import { getMongoClient } from "./mongodb-client";
import { AuthRepoMongo } from "./storage/auth-repo-mongo";
import { config } from "./config";
import { AuthViewMongo } from "./storage/auth-view-mongo";

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const reqAccount = req.body.account;
    const reqPassword = req.body.password;

    if (!(isString(reqAccount) && isString(reqPassword))) {
        return res.status(400).json({ msg: "The format of account or password is invalid." });
    }

    const account = reqAccount as string;
    const password = reqPassword as string;

    try {
        const client = await getMongoClient();
        const repo = new AuthRepoMongo(client.db(config.dbName));

        const result = await signup(account, password, repo);

        if (result) {
            res.status(200).json({});
        } else {
            res.status(409).json({ msg: "The account has already existed." });
        }
    } catch (e) {
        res.status(500).json({});
    }
});

app.post("/login", async (req, res) => {
    const reqAccount = req.body.account;
    const reqPassword = req.body.password;

    if (!(isString(reqAccount) && isString(reqPassword))) {
        return res.status(400).json({ msg: "The format of account or password is invalid." });
    }

    const account = reqAccount as string;
    const password = reqPassword as string;

    try {
        const client = await getMongoClient();
        const view = new AuthViewMongo(client.db(config.dbName));

        const result = await validate(account, password, view);

        if (result) {
            const token = jwtSign({ account }, config.jwtSecret, { expiresIn: '1m' });
            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ msg: "account or password is incorrect." });
        }
    } catch (error) {
        res.status(500).json({});
    }
});

function isString(a: any): boolean {
    return typeof a === "string";
}

export { app };