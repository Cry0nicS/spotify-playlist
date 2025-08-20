import type {PlaylistInfoResponse} from "#shared/utils/types";
import {getEnvVars} from "#shared/utils/env-vars";
import {SpotifyPlaylistIdSchema} from "#shared/utils/schemas";
import * as z from "zod";
import {throwApiError, throwSpotifyError} from "~~/server/utils/error-helpers";
import {generateSpotifyToken} from "~~/server/utils/generate-spotify-token";

export default defineEventHandler<Promise<PlaylistInfoResponse>>(async (event) => {
    const spotifyBaseUrl = getEnvVars().SPOTIFY_BASE_URL;

    // Validate query parameters and extract the playlist ID.
    const result = SpotifyPlaylistIdSchema.safeParse(getQuery(event));

    if (!result.success) {
        throw throwApiError({
            statusCode: 409,
            statusMessage: "VALIDATION_ERROR",
            message: z.prettifyError(result.error),
            data: {
                title: "Data validation error",
                detail: "Please check the provided data.",
                zodIssue: result.error.issues
            }
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
        throw throwSpotifyError(error);
    }
});
