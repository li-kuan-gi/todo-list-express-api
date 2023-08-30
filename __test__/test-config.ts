import { AppConfig } from "@src/app";
import { config } from "@src/config";

export const testConfig: AppConfig = {
    ...config,
    mongodbUri: process.env.TEST_MONGODB_URI as string
};

export const testApiPort = Number(process.env.TEST_API_PORT);