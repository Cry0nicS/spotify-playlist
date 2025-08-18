<script setup lang="ts">
import type {PlaylistInfoResponse, PlaylistTracksResponse, TrackLine} from "#shared/utils/types";
import {SpotifyPlaylistSchema} from "#shared/utils/schemas";
import {ref} from "vue";

const isLoading = ref(false);
const errorMsg = ref("");

const formState = reactive({
    spotifyPlaylist: ""
});

const tracks = ref<TrackLine[]>([]);
const playlistInfo = ref<PlaylistInfoResponse | null>(null);
const copying = ref(false);
const largestImage = ref<{height: number; url: string; width: number} | null>(null);

// Resets the form data to initial state.
const resetFormData = () => {
    formState.spotifyPlaylist = "";
};

const getLargestImage = (
    images: {height: number; url: string; width: number}[]
): {height: number; url: string; width: number} => {
    return images.reduce((max, img) => (img.height > max.height ? img : max));
};

// Validate the playlist input using the shared schema directly
const validateForm = (): {success: true; id: string} | {success: false; error: string} => {
    const result = SpotifyPlaylistSchema.safeParse(formState.spotifyPlaylist);
    if (!result.success) {
        return {success: false, error: result.error.issues.pop()?.message ?? result.error.message};
    }
    // result.data is always the playlist ID (string)
    return {success: true, id: result.data!};
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
        const playlistInfoData = await $fetch<PlaylistInfoResponse>("/api/spotify/playlist-info", {
            method: "GET",
            query: {playlistId: validation.id}
        });

        playlistInfo.value = playlistInfoData;
        largestImage.value = getLargestImage(playlistInfoData.images);

        const playlistTracksData = await $fetch<PlaylistTracksResponse>(
            "/api/spotify/playlist-tracks",
            {
                method: "GET",
                query: {playlistId: validation.id}
            }
        );

        tracks.value = playlistTracksData.tracks ?? [];

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
    <div class="w-full space-y-6 p-6">
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

            <UCard
                v-if="playlistInfo"
                class="mx-auto max-w-sm overflow-hidden rounded-xl border border-gray-700 bg-gray-800/80 shadow-lg dark:bg-gray-800">
                <div class="flex flex-col items-center p-5 text-center">
                    <img
                        v-if="largestImage"
                        :src="largestImage.url"
                        :alt="playlistInfo.name"
                        :width="largestImage.width"
                        :height="largestImage.height"
                        class="mb-4 rounded-4xl object-cover shadow-md" />
                    <h2 class="mb-1 text-2xl font-bold text-white">
                        {{ playlistInfo.name }}
                    </h2>
                    <p class="text-sm text-gray-400">
                        By
                        <span class="font-medium text-green-500">
                            {{ playlistInfo.owner.display_name }}
                        </span>
                    </p>
                    <p class="mt-1 text-sm text-gray-400">{{ playlistInfo.tracks.total }} tracks</p>
                    <p
                        v-if="playlistInfo.description"
                        class="mt-4 text-sm leading-relaxed text-gray-300">
                        {{ playlistInfo.description }}
                    </p>
                </div>
            </UCard>

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
            <ul class="mt-4 space-y-1">
                <li
                    v-for="(track, idx) in tracks"
                    :key="idx"
                    class="group flex items-center gap-3 text-gray-300 transition-colors duration-150 hover:text-white">
                    <span class="w-6 text-right text-gray-500 group-hover:text-green-500">
                        {{ idx + 1 }}
                    </span>
                    <span>
                        <span class="text-gray-400">{{ track.artist }}</span>
                        <span class="text-secondary px-2">-</span>
                        <span class="text-main font-medium">{{ track.song }}</span>
                    </span>
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
