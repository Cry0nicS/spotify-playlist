import type {H3Error} from "h3";
import type * as z from "zod";
// eslint-disable-next-line ts/consistent-type-imports -- z.infer<typeof Schema> requires Schema to be imported as a value
import {EnvVarsSchema} from "#shared/utils/schemas";

export type EnvVars = z.infer<typeof EnvVarsSchema>;

export interface ApiErrorPayload {
    title: string;
    detail: string;
    zodIssue?: z.core.$ZodIssue[];
}

/**
 * Extends H3Error with an optional data payload for API errors.
 */
export interface ApiError extends Pick<H3Error, "statusCode" | "statusMessage" | "message"> {
    data?: ApiErrorPayload;
}
