import type {
    PlaylistTracksResponse,
    SpotifyArtist,
    SpotifyPlaylistItemsPage,
    TrackLine
} from "#shared/utils/types";
import {getEnvVars} from "#shared/utils/env-vars";
import {SpotifyPlaylistIdSchema} from "#shared/utils/schemas";
import * as z from "zod";
import {generateSpotifyToken} from "~~/server/utils/generate-spotify-token";

export default defineEventHandler<Promise<PlaylistTracksResponse>>(async (event) => {
    const tracks: TrackLine[] = [];

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
        const fields = ["items(track(name,artists(name)))", "next"].join(",");

        const limit = 100;

        // Build the initial URL for the first page of playlist tracks
        let nextUrl: string | null =
            `${spotifyBaseUrl}/playlists/${encodeURIComponent(playlistId)}/tracks?fields=${fields}&limit=${limit}`;

        while (nextUrl) {
            // Fetch a page of playlist items
            const pageData: SpotifyPlaylistItemsPage = await $fetch<SpotifyPlaylistItemsPage>(
                nextUrl,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // Extract track and artist info from each item
            for (const item of pageData.items) {
                if (!item?.track) continue;

                const artists = item.track.artists
                    .map((artist: SpotifyArtist) => artist.name)
                    .join(", ");

                tracks.push({artist: artists, song: item.track.name});
            }

            // Follow the 'next' link for pagination
            nextUrl = pageData.next;
        }

        return {tracks} as PlaylistTracksResponse;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Spotify API error ${error instanceof Error ? error.message : String(error)}`
        });
    }
});
