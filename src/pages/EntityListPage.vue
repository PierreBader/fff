<template>
    <q-page class="q-pa-md">
        <div class="q-pa-md q-gutter-sm">
            <q-input v-model="search" label="Rechercher" dense>
                <template v-slot:prepend>
                    <q-icon name="search" />
                </template>
            </q-input>
            <div class="row q-gutter-xs items-center">
                <div class="text-subtitle2 q-mr-sm">{{ t("entity.entity_type") }} :</div>

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

        <div class="row q-col-gutter-md">
            <q-table
                title="Entités"
                :rows="entities"
                :columns="columns"
                flat
                bordered
                row-key="id"
                :loading="loading"
                :dense="$q.screen.lt.md"
            >
            </q-table>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useEntitiesStore } from "../stores/entities";
import type { Entity } from "../components/types";
import type { QTableColumn } from "quasar";
import { useI18n } from "vue-i18n";

import { useQuasar } from "quasar";

const $q = useQuasar();

const entitiesStore = useEntitiesStore();
const { t } = useI18n();

const entities = ref<Entity[]>([]);
const search = ref<string>();
const loading = ref<boolean>(false);

const selectedRoles = ref<string[]>([]);

const columns = ref<QTableColumn<Entity>[]>([
    {
        name: "name",
        label: t("entity.name"),
        field: "name",
        align: "left",
        sortable: true,
    },
    {
        name: "entity_type",
        label: t("entity.entity_type"),
        field: "entity_type",
        align: "left",
        sortable: true,
    },
    {
        name: "description",
        label: "Description",
        field: "description",
        align: "left",
        sortable: true,
    },
    {
        name: "contact_email",
        label: "Contact e-mail",
        field: "contact_email",
        align: "left",
        sortable: true,
    },
    {
        name: "contact_phone",
        label: "Contact téléphone",
        field: "contact_phone",
        align: "left",
        sortable: true,
    },
    {
        name: "cost_range",
        label: "Coût",
        field: "cost_range",
        align: "right",
        sortable: true,
    },
    {
        name: "availability",
        label: "Disponibilité",
        field: "availability",
        align: "left",
        sortable: true,
    },
    {
        name: "action_zone",
        label: "Zone d'action",
        field: "action_zone",
        align: "left",
        sortable: true,
    },
    {
        name: "likes",
        label: "J'aime",
        field: (row) => row.likes?.count,
        align: "left",
        sortable: true,
    },
]);

function toggleRole(role: string) {
    const index = selectedRoles.value.indexOf(role);
    if (index > -1) {
        selectedRoles.value.splice(index, 1);
    } else {
        selectedRoles.value.push(role);
    }
}

const entityTypes = computed(() => [
    { value: "organizer", label: t("entity.types.organizer") },
    { value: "venue", label: t("entity.types.venue") },
    { value: "artist", label: t("entity.types.artist") },
    { value: "technician", label: t("entity.types.technician") },
    { value: "association", label: t("entity.types.association") },
    { value: "other", label: t("entity.types.other") },
]);

onMounted(async () => {
    loading.value = true;
    await entitiesStore.fetchEntities({ is_approved: true });
    entities.value = entitiesStore.entities;
    loading.value = false;
});

watch(
    () => entitiesStore.entities,
    (newEntities) => {
        entities.value = newEntities;
    },
);
</script>
