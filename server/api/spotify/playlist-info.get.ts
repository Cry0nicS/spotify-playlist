import type {PlaylistInfoResponse} from "#shared/utils/types";
import {getEnvVars} from "#shared/utils/env-vars";
import {SpotifyPlaylistIdSchema} from "#shared/utils/schemas";
import * as z from "zod";
import {generateSpotifyToken} from "~~/server/utils/generate-spotify-token";

export default defineEventHandler<Promise<PlaylistInfoResponse>>(async (event) => {
    const spotifyBaseUrl = getEnvVars().SPOTIFY_BASE_URL;

    // Validate query parameters and extract the playlist ID.
    const result = SpotifyPlaylistIdSchema.safeParse(getQuery(event));

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: z.prettifyError(result.error)
        });
    }

    const {playlistId} = result.data;

    try {
        const token = await generateSpotifyToken();
        const fields = [
            "description",
            "name",
            "owner(display_name)",
            "tracks(total)",
            "images"
        ].join(",");

        const url = `${spotifyBaseUrl}/playlists/${encodeURIComponent(playlistId)}?fields=${fields}`;

        return await $fetch<PlaylistInfoResponse>(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Spotify API error ${error instanceof Error ? error.message : String(error)}`
        });
    }
});
