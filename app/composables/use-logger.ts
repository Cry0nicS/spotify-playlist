import type {Logger} from "#shared/utils/types";
import {useNuxtApp} from "#app";

/**
 * Client wrapper for the logger plugin for convenience.
 */
export function useLogger(): Logger {
    const {logger} = useNuxtApp();

    return logger as Logger;
}
