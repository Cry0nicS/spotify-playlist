import type {ApiError, ApiErrorPayload, SpotifyErrorResponse} from "#shared/utils/types";
import {isZodIssueArray} from "#shared/utils/guards/zod";

/**
 * Checks if the data object matches the API error shape (internal or external).
 * Like Nitro/h3 or fetch errors.
 * Shape:
 * {
 *   message: string;
 *   statusMessage?: string;
 *   statusCode?: number;
 * }
 */
export function isErrorShape(
    value: unknown
): value is {message: string; statusMessage?: string; statusCode?: number} {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

    const {message, statusMessage, statusCode} = value as Record<string, unknown>;

    if (typeof message !== "string") return false;

    if (statusMessage !== undefined && typeof statusMessage !== "string") return false;

    return !(statusCode !== undefined && typeof statusCode !== "number");
}

/**
 * Checks if the error object matches the API error shape.
 * Shape:
 * {
 *   message: string;
 *   statusMessage?: string;
 *   statusCode?: number;
 *   data?: ApiErrorPayload;
 * }
 */
export function isApiError(error: unknown): error is ApiError {
    if (typeof error !== "object" || error === null) return false;

    const {statusCode, statusMessage, message, data} = error as Record<string, unknown>;

    if (typeof message !== "string") return false;

    if (statusCode !== undefined && typeof statusCode !== "number") return false;

    if (statusMessage !== undefined && typeof statusMessage !== "string") return false;

    if (data === undefined) return true;

    return isApiErrorPayload(data);
}

/**
 * Checks if the data object matches the API error shape (internal or external).
 * Shape:
 * {
 *   title: string;
 *   detail: string;
 *   zodIssue?: z.core.$ZodIssue[];
 * }
 */
export function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

    const {title, detail, zodIssue} = value as Record<string, unknown>;

    if (typeof title !== "string" || typeof detail !== "string") return false;

    return !(zodIssue !== undefined && !isZodIssueArray(zodIssue));
}

/**
 * Checks if the object has a 'data' property. Regardless of its shape.
 */
export function isErrorWithData(e: unknown): e is {data: unknown} {
    return typeof e === "object" && e !== null && Object.prototype.hasOwnProperty.call(e, "data");
}

/**
 * Checks if the object matches the Spotify-error expected shape.
 * Shape:
 * {
 *   error: {
 *    status: number;
 *    message: string;
 *   }
 * }
 */
export function isSpotifyErrorPayload(value: unknown): value is SpotifyErrorResponse {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

    const root = value as Record<string, unknown>;
    const error = root.error;

    if (typeof error !== "object" || error === null || Array.isArray(error)) return false;

    const {status, message} = error as Record<string, unknown>;

    return typeof status === "number" && typeof message === "string";
}
