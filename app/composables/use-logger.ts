import type Rollbar from "rollbar";
import {useNuxtApp} from "#app";

/**
 * Client wrapper for the logger plugin for convenience.
 */
export function useLogger(): ConsoleLogger | Rollbar {
    const {logger} = useNuxtApp();

    return logger as ConsoleLogger | Rollbar;
}
