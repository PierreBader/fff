<template>
    <q-card class="entity-card">
        <q-card-section>
            <div class="text-h6">{{ entity.name }}</div>
            <div class="text-subtitle2">{{ entityTypeLabel }}</div>
        </q-card-section>
        <q-card-section>
            <p>{{ entity.description }}</p>
            <p><strong>Zone d'action :</strong> {{ entity.action_zone }}</p>
            <p><strong>Coût :</strong> {{ entity.cost_range }}</p>
            <p><strong>Likes :</strong> {{ entity.likes?.count || 0 }}</p>
        </q-card-section>
        <q-card-actions>
            <q-btn flat round icon="favorite" @click="$emit('like', entity.id)" />
            <q-btn flat label="Voir plus" @click="showDetails = true" />
        </q-card-actions>

        <!-- Modal pour les détails -->
        <q-dialog v-model="showDetails">
            <q-card>
                <q-card-section>
                    <div class="text-h5">{{ entity.name }}</div>
                </q-card-section>
                <q-card-section>
                    <p><strong>Type :</strong> {{ entityTypeLabel }}</p>
                    <p><strong>Description :</strong> {{ entity.description }}</p>
                    <p><strong>Email :</strong> {{ entity.contact_email }}</p>
                    <p><strong>Téléphone :</strong> {{ entity.contact_phone }}</p>
                    <p v-if="entity.website_url">
                        <strong>Site web :</strong>
                        <a :href="entity.website_url" target="_blank">{{ entity.website_url }}</a>
                    </p>
                    <p v-if="entity.facebook_url">
                        <strong>Facebook :</strong>
                        <a :href="entity.facebook_url" target="_blank">{{ entity.facebook_url }}</a>
                    </p>
                    <p v-if="entity.instagram_url">
                        <strong>Instagram :</strong>
                        <a :href="entity.instagram_url" target="_blank">{{
                            entity.instagram_url
                        }}</a>
                    </p>
                </q-card-section>
                <q-card-actions>
                    <q-btn flat label="Fermer" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Entity } from '../components/types';

const props = defineProps<{
    entity: Entity;
}>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
    (e: 'like', entityId: string): void;
}>();

const showDetails = ref<boolean>(false);

const entityTypeLabel = computed(() => {
    const types: Record<string, string> = {
        organizer: 'Organisateur',
        venue: 'Salle',
        artist: 'Artiste/Groupe',
        technician: 'Technicien',
        association: 'Association',
        other: 'Autre',
    };
    return types[props.entity.entity_type] || props.entity.entity_type;
});
</script>

<style scoped>
.entity-card {
    height: 100%;
}
</style>
