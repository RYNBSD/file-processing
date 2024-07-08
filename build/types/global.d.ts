declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "production" | "development" | "test";
        }
    }
}
export {};
//# sourceMappingURL=global.d.ts.map