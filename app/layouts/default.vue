<template>
    <div class="flex min-h-screen flex-col">
        <div class="flex grow justify-center">
            <div class="flex min-h-full w-full max-w-[1280px] flex-col">
                <GenericHeader />

                <UContainer class="grow place-content-center py-8">
                    <slot />
                </UContainer>

                <GenericFooter>
                    <template #links>
                        <GenericThemeToggle>
                            <template #dark-mode>
                                <span>Light mode</span>
                            </template>
                            <template #light-mode>
                                <span>Dark mode</span>
                            </template>
                        </GenericThemeToggle>
                    </template>
                </GenericFooter>
            </div>
        </div>
    </div>
</template>
