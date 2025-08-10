export default defineNuxtConfig({
    compatibilityDate: "2025-07-16",
    css: ["./app/assets/main.css"],
    devtools: {enabled: true},
    eslint: {
        config: {
            standalone: false // <--- Required for Antfu ESLint config.
        }
    },
    modules: ["@nuxt/eslint", "@nuxt/ui"],
    runtimeConfig: {
        public: {
            nodeEnv: process.env.NODE_ENV || "development",
            rollbarClientToken: process.env.NUXT_PUBLIC_ROLLBAR_CLIENT_TOKEN || "",
            rollbarEnabled: process.env.NUXT_PUBLIC_ROLLBAR_ENABLED || "false"
        }
    },
    ssr: true,
    typescript: {
        strict: true,
        typeCheck: true
    },
    ui: {
        colorMode: true
    }
});
