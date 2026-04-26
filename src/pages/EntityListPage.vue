<template>
    <q-page class="q-pa-md">
        <div class="q-pa-md q-gutter-sm">
            <q-input v-model="search" label="Rechercher" dense>
                <template v-slot:prepend>
                    <q-icon name="search" />
                </template>
            </q-input>
            <div>
                <span>Filtrer: </span>
                <q-chip icon="event">Add to calendar</q-chip>
                <q-chip icon="bookmark">Bookmark</q-chip>
                <q-chip icon="alarm" label="Set alarm" />
                <q-chip icon="directions">Get directions</q-chip>

                <div class="row q-gutter-xs items-center">
                    <div class="text-subtitle2 q-mr-sm">Rôle :</div>

                    <q-chip
                        v-for="type in entityTypes"
                        :key="type.value"
                        clickable
                        @click="toggleRole(type.value)"
                    >
                        <q-icon
                            v-if="selectedRoles.includes(type.value)"
                            name="check"
                            size="xs"
                            class="q-mr-xs"
                        />
                        {{ type.label }}
                    </q-chip>
                </div>
            </div>
        </div>

        <div class="row q-col-gutter-md">
            <div class="col-md-6 col-xs-12" v-for="entity in entities" :key="entity.id">
                <EntityCard :entity="entity" @like="handleLike" />
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useEntitiesStore } from '../stores/entities';
import EntityCard from '../components/EntityCard.vue';
import type { Entity } from '../components/types';
import { useI18n } from 'vue-i18n';

const entitiesStore = useEntitiesStore();
const { t } = useI18n();

const entities = ref<Entity[]>([]);
const search = ref<string>();

const selectedRoles = ref<string[]>([]);

function toggleRole(role: string) {
    const index = selectedRoles.value.indexOf(role);
    if (index > -1) {
        selectedRoles.value.splice(index, 1);
    } else {
        selectedRoles.value.push(role);
    }
}

const entityTypes = computed(() => [
    { value: 'organizer', label: t('entity.types.organizer') },
    { value: 'venue', label: t('entity.types.venue') },
    { value: 'artist', label: t('entity.types.artist') },
    { value: 'technician', label: t('entity.types.technician') },
    { value: 'association', label: t('entity.types.association') },
    { value: 'other', label: t('entity.types.other') },
]);

onMounted(async () => {
    await entitiesStore.fetchEntities({ is_approved: true });
    entities.value = entitiesStore.entities;
    console.log(t('entity.types.organizer'));
});

watch(
    () => entitiesStore.entities,
    (newEntities) => {
        entities.value = newEntities;
    },
);

const handleLike = async (entityId: string): Promise<void> => {
    await entitiesStore.likeEntity(entityId);
};
</script>
