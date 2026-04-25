<template>
    <q-page class="q-pa-md">
        <q-card>
            <q-card-section>
                <h4>Tableau de bord Admin</h4>
            </q-card-section>
            <q-card-section>
                <q-tabs v-model="tab" class="text-primary">
                    <q-tab name="entities" label="Entités" />
                    <q-tab name="proposals" label="Propositions en attente" />
                </q-tabs>
                <q-tab-panels v-model="tab" animated>
                    <!-- Onglet Entités -->
                    <q-tab-panel name="entities">
                        <div class="q-mt-md">
                            <q-table
                                :rows="entities"
                                :columns="entityColumns"
                                row-key="id"
                                flat
                                bordered
                            >
                                <template v-slot:body-cell-actions="props">
                                    <q-td :props="props">
                                        <q-btn
                                            flat
                                            round
                                            icon="edit"
                                            @click="editEntity(props.row)"
                                        />
                                        <q-btn
                                            flat
                                            round
                                            icon="delete"
                                            @click="confirmDelete(props.row.id)"
                                        />
                                    </q-td>
                                </template>
                            </q-table>
                        </div>
                    </q-tab-panel>

                    <!-- Onglet Propositions -->
                    <q-tab-panel name="proposals">
                        <div class="q-mt-md">
                            <q-table
                                :rows="proposals"
                                :columns="proposalColumns"
                                row-key="id"
                                flat
                                bordered
                            >
                                <template v-slot:body-cell-actions="props">
                                    <q-td :props="props">
                                        <q-btn
                                            flat
                                            label="Approuver"
                                            color="positive"
                                            @click="confirmApprove(props.row)"
                                        />
                                        <q-btn
                                            flat
                                            label="Rejeter"
                                            color="negative"
                                            @click="confirmReject(props.row)"
                                        />
                                    </q-td>
                                </template>
                            </q-table>
                        </div>
                    </q-tab-panel>
                </q-tab-panels>
            </q-card-section>
        </q-card>

        <!-- Modal pour éditer une entité -->
        <q-dialog v-model="showEditDialog" v-if="editingEntity">
            <q-card>
                <q-card-section>
                    <h5>Éditer une entité</h5>
                </q-card-section>
                <q-card-section>
                    <q-form @submit.prevent="saveEntity">
                        <q-select
                            v-model="editingEntity.entity_type"
                            :options="entityTypes"
                            label="Type"
                            class="q-mb-md"
                            option-value="value"
                            option-label="label"
                        />
                        <q-input v-model="editingEntity.name" label="Nom" class="q-mb-md" />
                        <q-input
                            v-model="editingEntity.description"
                            label="Description"
                            type="textarea"
                            class="q-mb-md"
                        />
                        <q-input
                            v-model="editingEntity.contact_email"
                            label="Email"
                            class="q-mb-md"
                        />
                        <q-input
                            v-model="editingEntity.contact_phone"
                            label="Téléphone"
                            class="q-mb-md"
                        />
                        <q-input
                            v-model="editingEntity.action_zone"
                            label="Zone d'action"
                            class="q-mb-md"
                        />
                        <q-input v-model="editingEntity.cost_range" label="Coût" class="q-mb-md" />
                        <q-toggle
                            v-model="editingEntity.is_approved"
                            label="Approuvée"
                            class="q-mb-md"
                        />
                        <q-btn
                            label="Sauvegarder"
                            type="submit"
                            color="primary"
                            class="full-width"
                            :loading="loading"
                        />
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Modal de confirmation -->
        <q-dialog v-model="showConfirmDialog">
            <q-card>
                <q-card-section>
                    <h5>{{ confirmDialog.title }}</h5>
                    <p>{{ confirmDialog.message }}</p>
                </q-card-section>
                <q-card-actions>
                    <q-btn flat label="Annuler" v-close-popup />
                    <q-btn
                        flat
                        label="Confirmer"
                        color="primary"
                        @click="confirmAction"
                        v-close-popup
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useEntitiesStore } from '../stores/entities';
import type { Entity, EntityProposal } from '../components/types';

const $q = useQuasar();
const entitiesStore = useEntitiesStore();

/* ------------------ STATE ------------------ */

const tab = ref<'entities' | 'proposals'>('entities');
const entities = ref<Entity[]>([]);
const proposals = ref<EntityProposal[]>([]);

const showEditDialog = ref(false);
const showConfirmDialog = ref(false);

const editingEntity = ref<Entity | null>(null);
const loading = ref(false);

/* ------------------ CONFIRM DIALOG ------------------ */

type ConfirmAction =
    | { type: 'deleteEntity'; id: string }
    | { type: 'approveProposal'; proposal: EntityProposal }
    | { type: 'rejectProposal'; proposal: EntityProposal }
    | null;

const confirmDialog = ref<{
    title: string;
    message: string;
    action: ConfirmAction;
}>({
    title: '',
    message: '',
    action: null,
});

/* ------------------ DATA ------------------ */

const entityTypes = [
    { label: 'Organisateur', value: 'organizer' },
    { label: 'Salle', value: 'venue' },
    { label: 'Artiste/Groupe', value: 'artist' },
    { label: 'Technicien', value: 'technician' },
    { label: 'Association', value: 'association' },
    { label: 'Autre', value: 'other' },
];

/* ------------------ TABLES ------------------ */

const entityColumns = [
    { name: 'name', label: 'Nom', field: 'name', align: 'left' as const },
    { name: 'entity_type', label: 'Type', field: 'entity_type', align: 'left' as const },
    { name: 'action_zone', label: "Zone d'action", field: 'action_zone', align: 'left' as const },
    { name: 'is_approved', label: 'Approuvée', field: 'is_approved', align: 'left' as const },
    { name: 'actions', label: 'Actions', field: 'actions', align: 'right' as const },
];

const proposalColumns = [
    {
        name: 'name',
        label: 'Nom',
        field: (row: EntityProposal) => row.entity_data.name,
        align: 'left' as const,
    },
    {
        name: 'type',
        label: 'Type',
        field: (row: EntityProposal) => row.entity_data.entity_type,
        align: 'left' as const,
    },
    {
        name: 'user',
        label: 'Proposé par',
        field: (row: EntityProposal) => row.users?.full_name ?? '—',
        align: 'left' as const,
    },
    { name: 'actions', label: 'Actions', field: 'actions', align: 'right' as const },
];

/* ------------------ INIT ------------------ */

const loadData = async () => {
    await Promise.all([entitiesStore.fetchEntities(), entitiesStore.fetchProposals()]);

    entities.value = entitiesStore.entities;
    proposals.value = entitiesStore.proposals;
};

onMounted(loadData);

/* ------------------ ACTIONS ------------------ */

const editEntity = (entity: Entity) => {
    editingEntity.value = { ...entity };
    showEditDialog.value = true;
};

const saveEntity = async () => {
    if (!editingEntity.value) return;

    loading.value = true;

    const success = await entitiesStore.updateEntity(editingEntity.value.id, editingEntity.value);

    if (success) {
        showEditDialog.value = false;
        $q.notify({ type: 'positive', message: 'Entité mise à jour !' });
        await loadData();
    }

    loading.value = false;
};

/* ------------------ CONFIRM ------------------ */

const confirmDelete = (id: string) => {
    confirmDialog.value = {
        title: 'Supprimer une entité',
        message: 'Êtes-vous sûr ?',
        action: { type: 'deleteEntity', id },
    };
    showConfirmDialog.value = true;
};

const confirmApprove = (proposal: EntityProposal) => {
    confirmDialog.value = {
        title: 'Approuver une proposition',
        message: `Approuver "${proposal.entity_data.name}" ?`,
        action: { type: 'approveProposal', proposal },
    };
    showConfirmDialog.value = true;
};

const confirmReject = (proposal: EntityProposal) => {
    confirmDialog.value = {
        title: 'Rejeter une proposition',
        message: `Rejeter "${proposal.entity_data.name}" ?`,
        action: { type: 'rejectProposal', proposal },
    };
    showConfirmDialog.value = true;
};

const confirmAction = async () => {
    if (!confirmDialog.value.action) return;

    loading.value = true;

    const action = confirmDialog.value.action;

    switch (action.type) {
        case 'deleteEntity':
            await entitiesStore.deleteEntity(action.id);
            $q.notify({ type: 'positive', message: 'Entité supprimée !' });
            break;

        case 'approveProposal':
            await entitiesStore.approveProposal(action.proposal.id, action.proposal.entity_data);
            $q.notify({ type: 'positive', message: 'Proposition approuvée !' });
            break;

        case 'rejectProposal': {
            const feedback = prompt('Pourquoi rejeter ?');
            if (feedback) {
                await entitiesStore.rejectProposal(action.proposal.id, feedback);
                $q.notify({ type: 'positive', message: 'Proposition rejetée.' });
            }
            break;
        }
    }

    await loadData();
    loading.value = false;
};
</script>
