<template>
    <div class="flex h-[70px] w-full justify-center border-0">
        <div class="flex w-full items-center justify-between border-b-2 px-8">
            <ColorScheme
                placeholder="Logo"
                tag="span">
                <ClientOnly>
                    <GenericLogo :size="40" />
                </ClientOnly>
            </ColorScheme>
            <div class="flex min-w-[180px] items-center justify-end gap-4">
                <div class="p-2">
                    <GenericThemeToggle />
                </div>
            </div>
        </div>
    </div>
</template>
