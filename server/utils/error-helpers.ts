import type {ApiError} from "#shared/utils/types";
import {
    isApiError,
    isErrorShape,
    isErrorWithData,
    isSpotifyErrorPayload
} from "#shared/utils/guards";
import {getHttpStatusMessage} from "#shared/utils/helpers";
import capitalize from "lodash/capitalize";

/**
 * Extracts status code from various error formats
 */
function getStatusCode(error: unknown): number {
    if (isErrorWithData(error)) {
        if (isSpotifyErrorPayload(error.data)) {
            return error.data.error.status;
        }
        if (isErrorShape(error.data)) {
            return error.data.statusCode ?? 500;
        }
    }

    if (isApiError(error)) {
        return error.statusCode;
    }

    // Fallback to checking if the error is a standard object with a statusCode property
    return isErrorShape(error) ? (error.statusCode ?? 500) : 500;
}

/**
 * Extract a best-effort user-friendly message from an unknown error.
 */
export function getErrorMessage(error: unknown): string {
    if (isErrorWithData(error)) {
        if (isSpotifyErrorPayload(error.data)) {
            return error.data.error.message;
        }

        if (isApiError(error)) {
            return error.data?.title ?? error.message;
        }

        if (isErrorShape(error)) {
            return error.message;
        }
    }

    return String(error);
}

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
 * Normalizes any error into a standardized ApiError object.
 * Attempts to extract status code and user-friendly message from various error formats.
 */
export function createApiError(
    error: unknown,
    serviceName: string = "EXTERNAL_API",
    fallbackMessage?: string
): ApiError {
    const statusCode = getStatusCode(error);
    const errorMessage = getErrorMessage(error);

    // Use HTTP status message if available, otherwise use extracted message
    const message =
        fallbackMessage ??
        errorMessage ??
        getHttpStatusMessage(statusCode) ??
        "An unexpected error occurred";

    return {
        statusCode,
        statusMessage: `${serviceName.toUpperCase()}_ERROR`,
        message: errorMessage,
        data: {
            title: `A ${capitalize(serviceName)} error occurred`,
            detail: message,
            zodIssue: isErrorWithData(error) && isApiError(error) ? error.data?.zodIssue : undefined
        }
    } as ApiError;
}
