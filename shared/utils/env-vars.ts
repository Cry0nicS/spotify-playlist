import type {EnvVars} from "#shared/utils/types";
import {EnvVarsSchema} from "#shared/utils/schemas";

/**
 * Private environment variables used throughout the application.
 * These variables are validated against the zod schema defined above.
 * It does not include public variables that are exposed to the client (that start with NUXT_PUBLIC_).
 * Lazy getter is used to ensure that the environment variables are only read when needed.
 */
export const getEnvVars = (): EnvVars => {
    return EnvVarsSchema.parse(process.env);
};
