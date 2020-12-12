declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            STATIC_DIRNAME: string;
            DEV_SERVER_ADDRESS: string;
            DEV_SERVER_PORT: number;
            SERVER_PORT: number;
            NODE_ENV: string;
            HMR_SERVER_PORT: string;
            TEST_VAR: string;
            INJECT_STYLES: boolean;
        }
    }
}

export {};
