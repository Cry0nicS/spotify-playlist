import z from "zod";

export const envVarsSchema = z.object({
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
    NUXT_PUBLIC_ROLLBAR_CLIENT_TOKEN: z.string().min(1).optional()
});

export type EnvVars = z.infer<typeof envVarsSchema>;

/**
 * Private environment variables used throughout the application.
 * These variables are validated against the zod schema defined above.
 * It does not include public variables that are exposed to the client (that start with NUXT_PUBLIC_).
 * Lazy getter is used to ensure that the environment variables are only read when needed.
 */
export const getEnvVars = (): EnvVars => {
    return envVarsSchema.parse(process.env);
};
