<script setup lang="ts">
/**
 * This component renders a customizable logo for the application.
 *
 * Props:
 *  - height (optional): Specifies the height of the logo in pixels. If not provided, defaults to 85 pixels.
 *  - color (optional): Determines the color of the logo. The color should be one of the predefined values in the 'Color' enum.
 *
 * The component dynamically calculates the logo's width based on the provided height to maintain a consistent aspect ratio of 32:17.
 *
 * @displayName logo
 */
interface LogoProps {
    size?: number;
}

const {size = 50} = defineProps<LogoProps>();
</script>

<template>
    <NuxtLink to="/" aria-label="Home">
        <svg
            :height="size"
            :width="size"
            viewBox="0 0 512 512"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient
                    id="id1"
                    x1="0%"
                    x2="100%"
                    y1="0%"
                    y2="100%">
                    <stop
                        offset="0"
                        stop-color="#00FFB3" />
                    <stop
                        offset="1"
                        stop-color="#1DB954" />
                </linearGradient>
                <radialGradient
                    id="id2"
                    cx="50%"
                    cy="50%"
                    r="50%">
                    <stop
                        offset="0"
                        stop-color="#1DB954" />
                    <stop
                        offset="1"
                        stop-color="#003321" />
                </radialGradient>
                <linearGradient
                    id="id3"
                    x1="0%"
                    x2="100%"
                    y1="0%"
                    y2="0%">
                    <stop
                        offset="0"
                        stop-color="#FFFFFF" />
                    <stop
                        offset="1"
                        stop-color="#00FFB3" />
                </linearGradient>
                <linearGradient
                    id="id4"
                    x1="0%"
                    x2="100%"
                    y1="0%"
                    y2="0%">
                    <stop
                        offset="0"
                        stop-color="#FFFFFF" />
                    <stop
                        offset="1"
                        stop-color="#00FFB3" />
                </linearGradient>
                <linearGradient
                    id="id5"
                    x1="0%"
                    x2="100%"
                    y1="0%"
                    y2="0%">
                    <stop
                        offset="0"
                        stop-color="#FFFFFF" />
                    <stop
                        offset="1"
                        stop-color="#00FFB3" />
                </linearGradient>
                <linearGradient
                    id="id6"
                    x1="0%"
                    x2="100%"
                    y1="0%"
                    y2="100%">
                    <stop
                        offset="0"
                        stop-color="#FFFFFF" />
                    <stop
                        offset="1"
                        stop-color="#00FFB3" />
                </linearGradient>
            </defs>
            <circle
                cx="50%"
                cy="50%"
                fill="none"
                r="45%"
                stroke="url(#id1) none"
                stroke-width="12" />
            <circle
                cx="50%"
                cy="50%"
                fill="url(#id2) none"
                r="38%" />
            <path
                d="M 156,256 A 100,100 0 0,1 356,256"
                fill="none"
                opacity="0.85"
                stroke="url(#id3) none"
                stroke-linecap="round"
                stroke-width="6" />
            <path
                d="M 176,241 A 80,80 0 0,1 336,241"
                fill="none"
                opacity="0.85"
                stroke="url(#id4) none"
                stroke-linecap="round"
                stroke-width="6" />
            <path
                d="M 196,226 A 60,60 0 0,1 316,226"
                fill="none"
                opacity="0.85"
                stroke="url(#id5) none"
                stroke-linecap="round"
                stroke-width="6" />
            <polygon
                fill="url(#id6) none"
                opacity="0.95"
                points="220,200 220,312 320,256" />
        </svg>
    </NuxtLink>
</template>
