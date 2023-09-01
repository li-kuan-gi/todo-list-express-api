import { ISignup, IValidateLogin, Signup, ValidateLogin } from "@auth/service";
import { AuthRepoMongo, AuthViewMongo } from "@auth/storage";

import { SignupContainer, ValidateLoginContainer } from "@controller/auth";

import { MongoClientManager } from "./mongo-client-manager";
import { ContainerConfig } from "./container-config";
import { AddTaskContainer, ChangeExpectDurationContainer, CompleteTaskContainer, RemoveTaskContainer, ResumeTaskContainer, StartTaskContainer, StopTaskContainer } from "@controller/task";
import { AddTask, ChangeExpectDuration, CompleteTask, IAddTask, IChangeExpectDuration, ICompleteTask, IRemoveTask, IResumeTask, IStartTask, IStopTask, RemoveTask, ResumeTask, StartTask, StopTask } from "@task/service";
import { TaskRepoMongo } from "@task/storage";

export class DependencyContainer implements
    ValidateLoginContainer,
    SignupContainer,
    AddTaskContainer,
    RemoveTaskContainer,
    ChangeExpectDurationContainer,
    StartTaskContainer,
    StopTaskContainer,
    ResumeTaskContainer,
    CompleteTaskContainer {

    private manager: MongoClientManager;
    private config: ContainerConfig;

    constructor(config: ContainerConfig) {
        this.config = config;
        this.manager = new MongoClientManager(config.mongodbUri);
    }

    async setup() {
        await this.manager.connect();
    }

    getSignupService(): ISignup {
        const db = this.manager.getMongoClient().db(this.config.dbName);
        const repo = new AuthRepoMongo(db, this.config.userCollName);
        return new Signup(repo);
    }

    getValidateLoginService(): IValidateLogin {
        const db = this.manager.getMongoClient().db(this.config.dbName);
        const view = new AuthViewMongo(db, this.config.userCollName);
        return new ValidateLogin(view);
    }

    getAddTask(): IAddTask {
        const db = this.manager.getMongoClient().db(this.config.dbName);
        const repo = new TaskRepoMongo(db, this.config.taskCollName);
        return new AddTask(repo);
    };

    getRemoveTask(): IRemoveTask {
        const db = this.manager.getMongoClient().db(this.config.dbName);
        const repo = new TaskRepoMongo(db, this.config.taskCollName);
        return new RemoveTask(repo);
    };

    getChangeExpectDuration(): IChangeExpectDuration {
        const db = this.manager.getMongoClient().db(this.config.dbName);
        const repo = new TaskRepoMongo(db, this.config.taskCollName);
        return new ChangeExpectDuration(repo);
    }

    getStartTask(): IStartTask {
        const db = this.manager.getMongoClient().db(this.config.dbName);
        const repo = new TaskRepoMongo(db, this.config.taskCollName);
        return new StartTask(repo);
    };

    getStopTask(): IStopTask {
        const db = this.manager.getMongoClient().db(this.config.dbName);
        const repo = new TaskRepoMongo(db, this.config.taskCollName);
        return new StopTask(repo);
    };

    getResumeTask(): IResumeTask {
        const db = this.manager.getMongoClient().db(this.config.dbName);
        const repo = new TaskRepoMongo(db, this.config.taskCollName);
        return new ResumeTask(repo);
    };

    getCompleteTask(): ICompleteTask {
        const db = this.manager.getMongoClient().db(this.config.dbName);
        const repo = new TaskRepoMongo(db, this.config.taskCollName);
        return new CompleteTask(repo);
    };
}