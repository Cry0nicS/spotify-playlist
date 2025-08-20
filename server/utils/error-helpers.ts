import type {ApiError} from "#shared/utils/types";
import {
    isApiError,
    isErrorPayload,
    isErrorWithData,
    isSpotifyErrorPayload
} from "#shared/utils/guards";

/**
 * Always throws a properly serialized H3 error (Nitro/Nuxt).
 */
export function throwApiError(error: ApiError): never {
    throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage ?? "UNEXPECTED_ERROR",
        message: error.message,
        data: error.data
    });
}

/**
 * Extract a best-effort user-friendly message from an unknown error.
 */
export function getErrorMessage(error: unknown): string {
    if (isApiError(error)) return error.data?.title ?? error.message;

    if (isErrorWithData(error)) {
        if (isErrorPayload(error.data)) {
            return error.data.message;
        }
    }

    if (error instanceof Error && error.message) return error.message;

    return String(error);
}

export function throwSpotifyError(error: unknown): never {
    if (isErrorWithData(error) && isSpotifyErrorPayload(error.data)) {
        throw throwApiError({
            statusCode: error.data.status,
            statusMessage: "SPOTIFY_ERROR",
            message: error.data.message
        });
    }

    throw throwApiError({
        statusCode: 500,
        statusMessage: "SPOTIFY_ERROR",
        message: getErrorMessage(error)
    });
}
