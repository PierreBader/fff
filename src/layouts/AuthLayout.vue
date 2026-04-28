<template>
    <q-layout view="hHh lpR fFf" class="auth-background">
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<style scoped>
.auth-background {
    /* https://www.magicpattern.design/tools/css-backgrounds */
    background-image:
        repeating-radial-gradient(circle at 0px 0px, transparent 0px, rgb(255, 253, 242) 27px),
        repeating-linear-gradient(rgba(255, 185, 21, 0.104), rgb(229, 170, 35));
}
</style>
