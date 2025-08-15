<template>
    <main class="mx-auto max-w-xl space-y-8">
        <div class="py-16 text-center">
            <div
                class="gradient-spotify pulse-music mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full">
                <Icon
                    name="i-lucide-file-music"
                    class="h-12 w-12 text-white" />
            </div>
            <h3 class="text-main mb-3 text-2xl font-bold">Ready to Transform Your Music?</h3>
            <p class="text-secondary mb-6 text-lg">
                Enter a Spotify playlist URL above to discover AI-powered mini-playlists tailored to
                your taste
            </p>
            <div class="text-secondary flex flex-col gap-2 text-sm sm:flex-row">
                <span>✨ AI-powered playlist splitting</span>
                <span class="hidden sm:inline">•</span>
                <span>🎵 Seamless Spotify integration</span>
                <span class="hidden sm:inline">•</span>
                <span>⚡ Instant playlist creation</span>
            </div>
        </div>
        <UiUploadPlaylist />
    </main>
</template>
