/* eslint-disable no-console */
import type {Logger} from "#shared/utils/types";
import Rollbar from "rollbar";

interface LoggerOptions {
    enabled: boolean;
    accessToken?: string;
    environment?: string;
}

/**
 * Creates a logger instance based on the provided options.
 * If Rollbar is enabled and an access token is provided, it initializes a Rollbar logger.
 * If not, it falls back to a console logger that only logs in development mode.
 */
export function createLogger(options: LoggerOptions): Logger {
    if (options.enabled && options.accessToken) {
        return new Rollbar({
            accessToken: options.accessToken,
            captureUncaught: true,
            captureUnhandledRejections: true,
            payload: {
                environment: options.environment
            }
        });
    }
    // Fallback console logger.
    return {
        error: (...args) => options.environment === "development" && console.error(...args),
        warning: (...args) => options.environment === "development" && console.warn(...args),
        info: (...args) => options.environment === "development" && console.info(...args)
    };
}
