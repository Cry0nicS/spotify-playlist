<script setup lang="ts">
import {SPOTIFY_PLAYLIST_ID_REGEX} from "#shared/utils/constants";
import {ref} from "vue";
import z from "zod";

const spotifyPlaylistSchema = z.union([
    // Plain 22-character playlist ID
    z.string().regex(SPOTIFY_PLAYLIST_ID_REGEX, "Invalid Spotify playlist ID"),

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
]);

const formSchema = z.object({
    spotifyPlaylist: spotifyPlaylistSchema
});

const loading = ref(false);
const errorMsg = ref("");

const formState = reactive({
    spotifyPlaylist: ""
});

interface TrackLine {
    artist: string;
    song: string;
}
const tracks = ref<TrackLine[]>([]);
const copying = ref(false);

// Resets the form data to initial state.
const resetFormData = () => {
    formState.spotifyPlaylist = "";
};

async function onSubmit() {
    errorMsg.value = "";
    tracks.value = [];
    loading.value = true;

    try {
        const {spotifyPlaylist: playlistId} = formSchema.parse(formState);

        const data = await $fetch<TrackLine[]>("/api/spotify/playlist", {
            method: "GET",
            query: {playlistId}
        });

        tracks.value = data ?? [];

        // On success, reset the form data.
        resetFormData();
    } catch (err) {
        errorMsg.value = (err as Error).message || "Failed to load playlist.";
    } finally {
        loading.value = false;
    }
}

async function copyAll() {
    const text = tracks.value.map((t) => `${t.artist} - ${t.song}`).join("\n");
    await navigator.clipboard.writeText(text);
    copying.value = true;
    setTimeout(() => (copying.value = false), 1200);
}
</script>

<template>
    <div class="mx-auto max-w-2xl space-y-6 p-6">
        <div class="space-y-2">
            <h1 class="text-2xl font-semibold">Spotify Playlist → “Artist - Song”</h1>
            <p class="text-sm text-gray-500">
                Paste a Spotify playlist URL or ID. Nothing is stored—data vanishes on refresh.
            </p>
        </div>

        <UForm
            :state="formState"
            :schema="formSchema"
            @submit.prevent="onSubmit">
            <div class="space-y-4">
                <UFormField
                    label="Spotify Playlist URL or ID"
                    name="spotifyPlaylist"
                    :error="errorMsg">
                    <UInput
                        v-model="formState.spotifyPlaylist"
                        placeholder="e.g. https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
                        class="w-full"
                        size="md" />
                </UFormField>
                <div class="flex items-center justify-end">
                    <UButton
                        type="submit"
                        :disabled="loading || !formState.spotifyPlaylist.trim()"
                        :loading="loading"
                        trailing-icon="i-lucide-upload"
                        loading-icon="i-lucide-circle-arrow-up"
                        size="md"
                        class="flex w-full items-center justify-center gap-1.5 md:max-w-[200px]">
                        Parse
                    </UButton>
                </div>
            </div>
        </UForm>

        <div
            v-if="errorMsg"
            class="text-sm text-red-600">
            {{ errorMsg }}
        </div>

        <div
            v-if="tracks.length"
            class="space-y-3">
            <USeparator
                orientation="horizontal"
                :avatar="{
                    src: '/favicon.ico'
                }" />
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium">Tracks ({{ tracks.length }})</h2>
                <UButton
                    variant="soft"
                    size="xs"
                    :disabled="copying"
                    @click="copyAll">
                    {{ copying ? "Copied!" : "Copy all" }}
                </UButton>
            </div>
            <ul class="list-disc space-y-1 pl-6">
                <li
                    v-for="(t, idx) in tracks"
                    :key="idx">
                    {{ `${t.artist} - ${t.song}` }}
                </li>
            </ul>
        </div>
    </div>
</template>
