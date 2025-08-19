import type Rollbar from "rollbar";

export interface ConsoleLogger {
    error: (...args: Rollbar.LogArgument[]) => void;
    warning: (...args: Rollbar.LogArgument[]) => void;
    info: (...args: Rollbar.LogArgument[]) => void;
}

export type Logger = ConsoleLogger | Rollbar;
