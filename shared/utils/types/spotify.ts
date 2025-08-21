import type * as z from "zod";
// eslint-disable-next-line ts/consistent-type-imports -- z.infer<typeof Schema> requires Schema to be imported as a value
import {SpotifyAuthResponseSchema} from "#shared/utils/schemas";

export type TrackLine = {
    artist: string;
    song: string;
};

export type SpotifyArtist = {name: string};

export interface SpotifyItemTrack {
    name: string;
    artists: SpotifyArtist[];
}

export interface SpotifyPlaylistItemsPage {
    items: Array<{track: SpotifyItemTrack | null}>;
    next: string | null;
}

export type SpotifyAuthResponse = z.infer<typeof SpotifyAuthResponseSchema>;

export type PlaylistInfoResponse = {
    description: string;
    name: string;
    owner: {display_name: string | null};
    tracks: {
        total: number;
    };
    images: SpotifyPlaylistImage[];
};

export type PlaylistTracksResponse = {
    tracks: TrackLine[];
};

export type SpotifyPlaylistImage = {
    height: number | null;
    url: string;
    width: number | null;
};

export interface SpotifyErrorResponse {
    error: {
        status: number;
        message: string;
    };
}
