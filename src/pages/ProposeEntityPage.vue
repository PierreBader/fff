v
<template>
    <q-page class="q-pa-md">
        <q-card class="q-pa-md" style="max-width: 600px; margin: 0 auto">
            <q-card-section>
                <h4>Proposer une nouvelle entité</h4>
            </q-card-section>
            <q-card-section>
                <q-form @submit.prevent="handleSubmit">
                    <q-select
                        v-model="form.entity_type"
                        :options="entityTypes"
                        label="Type d'entité"
                        required
                        class="q-mb-md"
                        option-value="value"
                        option-label="label"
                    />
                    <q-input v-model="form.name" label="Nom" required class="q-mb-md" />
                    <q-input
                        v-model="form.description"
                        label="Description"
                        type="textarea"
                        class="q-mb-md"
                    />
                    <q-input
                        v-model="form.contact_email"
                        label="Email de contact"
                        type="email"
                        class="q-mb-md"
                    />
                    <q-input
                        v-model="form.contact_phone"
                        label="Téléphone de contact"
                        class="q-mb-md"
                    />
                    <q-input v-model="form.website_url" label="Site web" class="q-mb-md" />
                    <q-input
                        v-model="form.action_zone"
                        label="Zone d'action (ex: Lille, France)"
                        required
                        class="q-mb-md"
                    />
                    <q-input
                        v-model="form.cost_range"
                        label="Fourchette de prix (ex: 50-100€)"
                        class="q-mb-md"
                    />
                    <div class="row q-gutter-md q-mb-md">
                        <q-input
                            v-model.number="form.lat"
                            label="Latitude"
                            type="number"
                            step="0.000001"
                            class="col"
                        />
                        <q-input
                            v-model.number="form.lng"
                            label="Longitude"
                            type="number"
                            step="0.000001"
                            class="col"
                        />
                    </div>
                    <div class="row q-gutter-md q-mb-md">
                        <q-input v-model="form.facebook_url" label="Facebook" class="col" />
                        <q-input v-model="form.instagram_url" label="Instagram" class="col" />
                    </div>
                    <div class="row q-gutter-md q-mb-md">
                        <q-input v-model="form.youtube_url" label="YouTube" class="col" />
                        <q-input v-model="form.soundcloud_url" label="SoundCloud" class="col" />
                    </div>
                    <q-btn
                        label="Proposer"
                        type="submit"
                        color="primary"
                        class="full-width"
                        :loading="loading"
                    />
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitiesStore } from '../stores/entities';
import { useAuthStore } from '../stores/auth';
import type { Entity } from '../components/types';

const router = useRouter();
const entitiesStore = useEntitiesStore();
const authStore = useAuthStore();

const form = ref<Omit<Entity, 'id' | 'is_approved' | 'created_at' | 'updated_at'>>({
    entity_type: 'artist',
    name: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    website_url: '',
    action_zone: '',
    cost_range: '',
    lat: 48.8566,
    lng: 2.3522,
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    soundcloud_url: '',
});

const entityTypes = [
    { label: 'Organisateur', value: 'organizer' },
    { label: 'Salle', value: 'venue' },
    { label: 'Artiste/Groupe', value: 'artist' },
    { label: 'Technicien', value: 'technician' },
    { label: 'Association', value: 'association' },
    { label: 'Autre', value: 'other' },
];

const loading = ref<boolean>(false);

async function handleSubmit() {
    loading.value = true;
    const success = await entitiesStore.proposeEntity(
        {
            ...form.value,
        },
        authStore.user!.id,
    );
    if (success) {
        await router.push('/entities');
    }
    loading.value = false;
}
</script>
