import type {Logger} from "#shared/utils/types";
import {createLogger} from "#shared/utils/create-logger";
import {getEnvVars} from "#shared/utils/env-vars";

const envVars = getEnvVars();

/**
 * Initializes logger for error tracking in the server-side.
 */
const logger: Logger = createLogger({
    enabled: envVars.NUXT_PUBLIC_ROLLBAR_ENABLED,
    accessToken: envVars.ROLLBAR_SERVER_TOKEN,
    environment: envVars.NODE_ENV
});

export {logger};
