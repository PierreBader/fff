<template>
    <div style="height: 500px; width: 100%">
        <l-map :zoom="10" :center="center" @ready="onMapReady">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
            <l-marker
                v-for="entity in entities"
                :key="entity.id"
                :lat-lng="[entity.lat || 0, entity.lng || 0]"
                @click="selectEntity(entity)"
            >
                <l-popup>
                    <div>
                        <h3>{{ entity.name }}</h3>
                        <p>{{ entityTypeLabel(entity.entity_type) }} - {{ entity.action_zone }}</p>
                        <q-btn flat label="Voir plus" @click="selectEntity(entity)" />
                    </div>
                </l-popup>
            </l-marker>
        </l-map>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Entity } from './types';
import type { Map as LeafletMap } from 'leaflet';

const props = defineProps<{
    entities: Entity[];
}>();

const emit = defineEmits<{
    (e: 'select-entity', entity: Entity): void;
}>();

const center = ref<[number, number]>([47.814618142377114, 7.554421821156011]); // Neuenburg
const map = ref<LeafletMap | null>(null);

const onMapReady = (mapInstance: LeafletMap): void => {
    map.value = mapInstance;
    if (props.entities.length > 0) {
        const bounds: [number, number][] = props.entities
            .filter((entity) => entity.lat && entity.lng)
            .map((entity) => [entity.lat!, entity.lng!]);
        if (bounds.length > 0) {
            mapInstance.fitBounds(bounds);
        }
    }
};

const selectEntity = (entity: Entity): void => {
    emit('select-entity', entity);
};

const entityTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
        organizer: 'Organisateur',
        venue: 'Salle',
        artist: 'Artiste/Groupe',
        technician: 'Technicien',
        association: 'Association',
        other: 'Autre',
    };
    return types[type] || type;
};

watch(
    () => props.entities,
    (newEntities) => {
        if (newEntities.length > 0 && map.value) {
            const bounds: [number, number][] = props.entities
                .filter((entity) => entity.lat && entity.lng)
                .map((entity) => [entity.lat!, entity.lng!]);

            if (bounds.length > 0) {
                map.value.fitBounds(bounds);
            }
        }
    },
);
</script>
