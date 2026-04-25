<template>
    <q-page class="q-pa-md">
        <div class="q-mb-md">
            <h4>Entités culturelles</h4>
            <div class="row q-gutter-md q-mb-md">
                <q-select
                    v-model="filters.entity_type"
                    :options="entityTypes"
                    label="Type"
                    clearable
                    style="width: 200px"
                    option-value="value"
                    option-label="label"
                />
                <q-input
                    v-model="filters.action_zone"
                    label="Zone d'action"
                    clearable
                    style="width: 200px"
                />
                <q-btn label="Filtrer" color="primary" @click="applyFilters" />
                <q-btn
                    label="Proposer une entité"
                    color="secondary"
                    @click="router.push('/propose')"
                    v-if="authStore.user"
                />
            </div>
        </div>

        <div class="row q-col-gutter-md">
            <div class="col-md-6 col-xs-12" v-for="entity in entities" :key="entity.id">
                <EntityCard :entity="entity" @like="handleLike" />
            </div>
        </div>

        <!-- Carte -->
        <div class="q-mt-lg">
            <MapView :entities="entities" @select-entity="selectEntity" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useEntitiesStore } from '../stores/entities';
import EntityCard from '../components/EntityCard.vue';
import MapView from '../components/MapView.vue';
import type { Entity } from '../components/types';

const router = useRouter();
const authStore = useAuthStore();
const entitiesStore = useEntitiesStore();

const entities = ref<Entity[]>([]);
const filters = ref<{ entity_type?: string; action_zone?: string }>({});

const entityTypes = [
    { label: 'Organisateur', value: 'organizer' },
    { label: 'Salle', value: 'venue' },
    { label: 'Artiste/Groupe', value: 'artist' },
    { label: 'Technicien', value: 'technician' },
    { label: 'Association', value: 'association' },
    { label: 'Autre', value: 'other' },
];

onMounted(async () => {
    await entitiesStore.fetchEntities({ is_approved: true });
    entities.value = entitiesStore.entities;
});

watch(
    () => entitiesStore.entities,
    (newEntities) => {
        entities.value = newEntities;
    },
);

const applyFilters = async (): Promise<void> => {
    await entitiesStore.fetchEntities({
        ...filters.value,
        is_approved: true,
    });
};

const handleLike = async (entityId: string): Promise<void> => {
    await entitiesStore.likeEntity(entityId);
};

const selectEntity = (entity: Entity): void => {
    alert(`Entité sélectionnée : ${entity.name}`);
};
</script>
