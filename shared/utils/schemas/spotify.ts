import {SPOTIFY_PLAYLIST_ID_REGEX} from "#shared/utils/constants";
import z from "zod";

/**
 * Schema for Spotify authentication response.
 * Validates the shape of the response returned by Spotify's auth endpoint.
 */
export const SpotifyAuthResponseSchema = z.object({
    access_token: z.string().min(1),
    token_type: z.literal("Bearer"), // Spotify returns "Bearer"
    expires_in: z.number().int().positive()
});

/**
 * Single string schema: validates a raw playlist ID string.
 * Usage: For direct string validation, e.g. from a form or query param.
 */
export const SpotifyPlaylistIdStringSchema = z
    .string()
    .regex(SPOTIFY_PLAYLIST_ID_REGEX, "Invalid Spotify playlist ID");

/**
 * Object schema: validates an object with a playlistId property.
 * Usage: For validating an object, e.g. { playlistId: string } from query.
 */
export const SpotifyPlaylistIdSchema = z.object({
    playlistId: SpotifyPlaylistIdStringSchema
});

/**
 * Union schema: accepts either a raw ID string or a Spotify playlist URL.
 * Usage: For flexible input (ID or URL), transforms URL to ID.
 */
export const SpotifyPlaylistSchema = z.union(
    [
        // Plain 22-character playlist ID
        SpotifyPlaylistIdStringSchema,

        // Strict Spotify playlist URL
        z
            .url({
                protocol: /^https$/,
                hostname: /^open\.spotify\.com$/
            })
            .refine((urlStr) => {
                try {
                    const url = new URL(urlStr); // create URL object
                    return /^\/playlist\/[0-9A-Za-z]{22}\/?$/u.test(url.pathname);
                } catch {
                    return false;
                }
            }, "Must be a Spotify playlist URL like https://open.spotify.com/playlist/{id}")
            .transform((urlStr) => {
                const url = new URL(urlStr);
                return url.pathname.split("/")[2]; // extract the ID
            })
    ],
    {
        error: () => ({
            message:
                "Enter a Spotify playlist URL (https://open.spotify.com/playlist/{id}) or a 22-character playlist ID."
        })
    }
);
