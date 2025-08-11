import {getEnvVars} from "#shared/utils/env-vars";
import z from "zod";
import {generateSpotifyToken} from "~~/server/utils/generate-spotify-token";

const QuerySchema = z.object({
    playlistId: z
        .string()
        .min(1, "playlistId is required")
        // Spotify IDs are 22-char base62; still allow longer in case of future changes but basic guard helps
        .regex(/^[0-9A-Za-z]{22}$/u, "Invalid Spotify playlist ID")
});

// Minimal, explicit typing for the shape we return to the client
export type TrackLine = {
    artist: string;
    song: string;
};

// Spotify API response fragments used here
type SpotifyArtist = {name: string};

// Track can be null for removed items
interface SpotifyItemTrack {
    name: string;
    artists: SpotifyArtist[];
}

interface SpotifyPlaylistItemsPage {
    items: Array<{track: SpotifyItemTrack | null}>;
    next: string | null;
}

export default defineEventHandler(async (event) => {
    const tracks: TrackLine[] = [];

    const spotifyBaseUrl = getEnvVars().SPOTIFY_BASE_URL;

    // Validate query parameters and extract the playlist ID.
    const result = QuerySchema.safeParse(getQuery(event));

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: z.prettifyError(result.error)
        });
    }

    const {playlistId} = result.data;
    const token = await generateSpotifyToken();

    try {
        // First page, then follow `next`
        let nextUrl: string | null = `${spotifyBaseUrl}/playlists/${encodeURIComponent(
            playlistId
        )}/tracks?fields=items(track(name,artists(name))),next&limit=100`;

        while (nextUrl) {
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

            for (const item of pageData.items) {
                if (!item?.track) continue;

                const artists = item.track.artists
                    .map((artist: SpotifyArtist) => artist.name)
                    .join(", ");

                tracks.push({artist: artists, song: item.track.name});
            }

            nextUrl = pageData.next;
        }

        // const payload: PlaylistResponse = {tracks};
        return tracks;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Spotify API error ${error instanceof Error ? error.message : String(error)}`
        });
    }
});
