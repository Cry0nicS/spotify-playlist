export const SPOTIFY_PLAYLIST_ID_REGEX = /^[0-9A-Za-z]{22}$/u;

/**
 * Maps HTTP status codes to user-friendly messages
 */
export const HTTP_STATUS_MESSAGES: Record<number, string> = {
    400: "Invalid request parameters",
    401: "Authentication required",
    403: "Access forbidden",
    404: "Resource not found",
    409: "Conflict",
    422: "Validation error",
    429: "Rate limit exceeded",
    500: "Internal server error",
    502: "Service temporarily unavailable",
    503: "Service unavailable"
} as const;
