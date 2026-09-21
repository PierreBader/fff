<template>
    <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useLocaleStore } from "src/stores/locale";

const localeStore = useLocaleStore();

onMounted(() => {
    localeStore.initLocale();
});
</script>
