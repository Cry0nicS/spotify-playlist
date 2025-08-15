export default defineNuxtConfig({
    compatibilityDate: "2025-07-16",
    css: ["./app/assets/main.css"],
    devtools: {enabled: true},
    eslint: {
        config: {
            standalone: false // <--- Required for Antfu ESLint config.
        }
    },
    fonts: {
        families: [
            {name: "Inter", provider: "google", weights: [400, 500, 700]},
            {name: "Nunito", provider: "google", weights: [700, 800]}
        ]
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
