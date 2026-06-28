<template>
    <q-layout view="hHh lpR fFf" class="auth-background" :class="backgroundClass">
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const index = ref<number>(1);

const backgroundClass = computed(() => 'bg' + index.value);

onMounted(() => {
    cycleIndex();
});

function cycleIndex() {
    if (index.value >= 6) index.value = 1;
    else index.value++;

    setTimeout(cycleIndex, 8000);
}
</script>

<style scoped>
.auth-background {
    transition: background-image 1s ease-in-out;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
.auth-background::after {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    z-index: -1;
    content: url(../assets/background1.webp) url(../assets/background2.webp)
        url(../assets/background3.webp) url(../assets/background4.webp)
        url(../assets/background5.webp) url(../assets/background6.webp);
}
.auth-background.bg1 {
    background-image: url(../assets/background1.webp);
}
.auth-background.bg2 {
    background-image: url(../assets/background2.webp);
}
.auth-background.bg3 {
    background-image: url(../assets/background3.webp);
}
.auth-background.bg4 {
    background-image: url(../assets/background4.webp);
}
.auth-background.bg5 {
    background-image: url(../assets/background5.webp);
}
.auth-background.bg6 {
    background-image: url(../assets/background6.webp);
}
</style>
