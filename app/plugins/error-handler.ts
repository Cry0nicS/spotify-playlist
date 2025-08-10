export default defineNuxtPlugin((nuxtApp) => {
    const clientLogger = useLogger();

    // Hook into Vue's error handler
    nuxtApp.hook("vue:error", (error, instance, info) => {
        clientLogger.error(error as Error, {instance, info});
    });

    // Hook into Nuxt's app error handler
    nuxtApp.hook("app:error", (error) => {
        clientLogger.error(error);
    });
});
