declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            mongodbUrl: string;
            topggPassword: string;
            ubfbToken: string;
            errorWebhook: string;
            enviroment: "dev" | "prod" | "debug";
            PasswordApi: string;
            OpenAIApi: string;
            username: string;
            password: string;
            imageDbUrl: string;
            linkserver: string;
            linkpassword: string;
            linkErrorTracker: string;
            spotifyClientId: string;
            spotifyClientSecret: string;
        }
    }
}

export {};
