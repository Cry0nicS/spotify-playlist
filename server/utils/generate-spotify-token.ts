import type {SpotifyAuthResponse} from "#shared/utils/types";
import {Buffer} from "node:buffer";
import {getEnvVars} from "#shared/utils/env-vars";
import {SpotifyAuthResponseSchema} from "#shared/utils/schemas";
import {createApiError} from "~~/server/utils/error-helpers";

type CachedToken = {
    token: string;
    expiresAt: number;
};

let cache: CachedToken | null = null;

const LEEWAY_SECONDS = 30; // refresh just before expiry for safety

/**
 * Generates a Spotify API token using client credentials.
 * Caches the token until it is close to expiry.
 */
export async function generateSpotifyToken(): Promise<string> {
    const now = Date.now();

    if (cache && cache.expiresAt > now) {
        return cache.token;
    }

    const clientId = getEnvVars().SPOTIFY_CLIENT_ID;
    const clientSecret = getEnvVars().SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throwApiError({
            statusCode: 500,
            statusMessage: "MISSING_SPOTIFY_CREDENTIALS",
            message: "Spotify client ID and secret must be set in environment variables.",
            data: {
                title: "An unexpected error occurred",
                detail: "Please contact the administrator."
            }
        });
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const body = new URLSearchParams({grant_type: "client_credentials"});

    try {
        const response = await $fetch<SpotifyAuthResponse>(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${credentials}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body
            }
        );

        const data = SpotifyAuthResponseSchema.parse(response);
        const expiresAt = now + (data.expires_in - LEEWAY_SECONDS) * 1000;

        cache = {token: data.access_token, expiresAt};

        return cache.token;
    } catch (error) {
        throwApiError(
            createApiError(error, "Spotify token generation", "Failed to generate Spotify token")
        );
    }
}
