<script setup lang="ts">
import {SPOTIFY_PLAYLIST_ID_REGEX} from "#shared/utils/constants";
import {ref} from "vue";
import z from "zod";

const spotifyPlaylistSchema = z.union(
    [
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
    ],
    {
        error: () => ({
            message:
                "Enter a Spotify playlist URL (https://open.spotify.com/playlist/{id}) or a 22-character playlist ID."
        })
    }
);

const formSchema = z.object({
    spotifyPlaylist: spotifyPlaylistSchema
});

const isLoading = ref(false);
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

const validateForm = (): {success: true; id: string} | {success: false; error: string} => {
    const result = formSchema.safeParse(formState);
    if (!result.success) {
        return {success: false, error: result.error.issues.pop()?.message ?? result.error.message};
    }
    return {success: true, id: result.data.spotifyPlaylist!};
};

const parsePlaylist = async () => {
    errorMsg.value = "";
    tracks.value = [];
    isLoading.value = true;

    const validation = validateForm();

    if (!validation.success) {
        errorMsg.value = validation.error;
        isLoading.value = false;
        return;
    }

    try {
        const result = await $fetch<TrackLine[]>("/api/spotify/playlist", {
            method: "GET",
            query: {playlistId: validation.id}
        });

        tracks.value = result ?? [];

        // On success, reset the form data.
        resetFormData();
    } catch (err) {
        errorMsg.value = (err as Error).message || "Failed to load playlist.";
    } finally {
        isLoading.value = false;
    }
};

async function copyAll() {
    const text = tracks.value.map((t) => `${t.artist} - ${t.song}`).join("\n");
    await navigator.clipboard.writeText(text);
    copying.value = true;
    setTimeout(() => (copying.value = false), 1200);
}
</script>

<template>
    <div class="mx-auto max-w-2xl space-y-6 p-6">
        <UCard class="playlist-card bg-secondary border-main mb-8">
            <template #header>
                <div class="flex items-center justify-center gap-3">
                    <div class="gradient-spotify pulse-music h-3 w-3 rounded-full"></div>
                    <h2 class="text-main text-xl font-semibold">Import Playlist</h2>
                </div>
            </template>
            <UForm
                :state="formState"
                @submit="parsePlaylist">
                <div class="space-y-4">
                    <UFormField
                        label="Spotify Playlist URL or ID"
                        name="spotifyPlaylist"
                        :error="errorMsg">
                        <UInput
                            v-model="formState.spotifyPlaylist"
                            placeholder="e.g. https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
                            class="w-full"
                            required
                            size="md" />
                    </UFormField>
                    <div class="flex items-center justify-end">
                        <UButton
                            type="submit"
                            :disabled="isLoading"
                            :loading="isLoading"
                            loading-icon="i-lucide-circle-arrow-up"
                            size="md"
                            class="gradient-spotify flex w-full items-center justify-center gap-1.5 md:max-w-[200px]"
                            :ui="{
                                base: !formState.spotifyPlaylist.trim()
                                    ? 'transition-all duration-200 hover:transform hover:-translate-y-0.5'
                                    : ''
                            }">
                            <template #leading>
                                <Icon name="i-lucide-music-4" />
                            </template>
                            {{ isLoading ? "Parsing..." : "Parse Playlist" }}
                        </UButton>
                    </div>
                </div>
            </UForm>
        </UCard>

        <div
            v-if="errorMsg"
            class="text-sm text-red-600">
            {{ errorMsg }}
        </div>
        <!-- Songs -->
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

        <!-- Empty State -->
        <div
            v-else
            class="py-12 text-center">
            <Icon
                name="i-lucide-list-music"
                class="text-secondary mx-auto mb-4 h-16 w-16" />
            <h3 class="text-main mb-2 text-lg font-semibold">No playlist loaded</h3>
            <p class="text-secondary">Enter a Spotify playlist URL above to get started</p>
        </div>

        <!-- Loading State Overlay -->
        <div
            v-if="isLoading"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <UCard class="bg-accented border-main">
                <div class="flex items-center gap-4 p-6">
                    <div
                        class="gradient-spotify h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <div>
                        <p class="text-main font-semibold">Parsing your playlist...</p>
                        <p class="text-secondary text-sm">This may take a few moments</p>
                    </div>
                </div>
            </UCard>
        </div>
    </div>
</template>
