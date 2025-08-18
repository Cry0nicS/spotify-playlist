import z from "zod";

export const EnvVarsSchema = z.object({
    NODE_ENV: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                return val.replace(/^"(.*)"$/, "$1").trim(); // strip quotes and trim
            }
            return val;
        },
        z.enum(["development", "production", "staging"]).default("development")
    ),
    NUXT_PUBLIC_ROLLBAR_ENABLED: z.preprocess(
        (val) => val === "true" || val === true,
        z.boolean().default(false)
    ),
    ROLLBAR_SERVER_TOKEN: z.string().min(1).optional(),
    NUXT_PUBLIC_ROLLBAR_CLIENT_TOKEN: z.string().min(1).optional(),
    SPOTIFY_BASE_URL: z.url(),
    SPOTIFY_CLIENT_ID: z.string().min(1),
    SPOTIFY_CLIENT_SECRET: z.string().min(1)
});
