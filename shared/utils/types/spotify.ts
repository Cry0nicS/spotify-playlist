import type {SpotifyAuthResponseSchema} from "#shared/utils/schemas";
import type z from "zod";

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
    owner: {display_name: string};
    tracks: {
        total: number;
    };
    images: [{height: number; width: number; url: string}];
};

export type PlaylistTracksResponse = {
    tracks: TrackLine[];
};
