import express from "express";
import { getSignupController } from "./controller/signup";
import { container } from "./container";
import { getLoginController } from "./controller/login";

export const getApp = () => {
    const app = express();

    app.use(express.json());

    app.post("/signup", getSignupController(container.getSignupService()));

    app.post("/login", getLoginController(container.getValidateLoginService()));

    return app;
};