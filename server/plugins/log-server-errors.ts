import {logger} from "~~/server/utils/logger";

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook("error", (error, event) => {
        logger.error(error, {path: event.path, method: event.method});
    });
});
