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
export function isErrorPayload(
    value: unknown
): value is {message: string; statusMessage?: string; statusCode?: number} {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

    const {message, statusMessage, statusCode} = value as Record<string, unknown>;

    if (typeof message !== "string") return false;

    if (statusMessage !== undefined && typeof statusMessage !== "string") return false;

    return !(statusCode !== undefined && typeof statusCode !== "number");
}

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
 * Checks if the object has a 'data' property.
 */
export function isErrorWithData(e: unknown): e is {data: unknown} {
    return typeof e === "object" && e !== null && "data" in e;
}

export function isSpotifyErrorPayload(value: unknown): value is SpotifyErrorResponse {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

    const {status, message} = value as Record<string, unknown>;

    if (typeof message !== "string") return false;

    return !(status !== undefined && typeof status !== "number");
}
