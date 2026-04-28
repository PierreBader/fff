<template>
    <q-select
        v-model="locale"
        :options="localeOptions"
        :label="t('lang.label')"
        dense
        borderless
        emit-value
        map-options
        options-dense
        style="min-width: 150px"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n({ useScope: 'global' });

const localeOptions = computed(() => [
    { value: 'fr-FR', label: t('lang.fr-FR') },
    { value: 'de-DE', label: t('lang.de-DE') },
    { value: 'en-US', label: t('lang.en-US') },
]);
</script>
