<template>
    <q-page class="q-pa-md">
        <div class="text-center q-mb-lg">
            <h2>Bienvenue sur la plateforme culturelle transfrontalière</h2>
            <p>Découvrez et proposez des acteurs culturels dans votre région.</p>
            <q-btn
                v-if="!authStore.user"
                label="Se connecter"
                color="primary"
                @click="router.push('/login')"
                class="q-mt-md"
            />
            <q-btn
                v-else
                label="Voir les entités"
                color="primary"
                @click="router.push('/entities')"
                class="q-mt-md"
            />
        </div>
        <MapView :entities="entities" />
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useEntitiesStore } from '../stores/entities';
import MapView from '../components/MapView.vue';
import type { Entity } from '../components/types';

const router = useRouter();
const authStore = useAuthStore();
const entitiesStore = useEntitiesStore();

const entities = ref<Entity[]>([]);

onMounted(async () => {
    await entitiesStore.fetchEntities({ is_approved: true, limit: 10 });
    entities.value = entitiesStore.entities;
});
</script>
