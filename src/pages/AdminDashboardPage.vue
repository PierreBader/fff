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
    <q-dialog v-model="showEditDialog">
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
            <q-input
              v-model="editingEntity.name"
              label="Nom"
              class="q-mb-md"
            />
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
            <q-input
              v-model="editingEntity.cost_range"
              label="Coût"
              class="q-mb-md"
            />
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
import { ref, onMounted, type Ref } from 'vue';
import { useQuasar } from 'quasar';
import { useEntitiesStore } from '../stores/entities';
import type { Entity, EntityProposal } from '../components/types';

const $q = useQuasar();
const entitiesStore = useEntitiesStore();

const tab = ref<'entities' | 'proposals'>('entities');
const entities: Ref<Entity[]> = ref([]);
const proposals: Ref<EntityProposal[]> = ref([]);
const showEditDialog = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);
const editingEntity: Ref<Partial<Entity>> = ref({});
const loading = ref<boolean>(false);

const confirmDialog = ref<{
  title: string;
  message: string;
  action: 'deleteEntity' | 'approveProposal' | 'rejectProposal' | null;
  params: any;
}>({
  title: '',
  message: '',
  action: null,
  params: null,
});

const entityTypes = [
  { label: 'Organisateur', value: 'organizer' },
  { label: 'Salle', value: 'venue' },
  { label: 'Artiste/Groupe', value: 'artist' },
  { label: 'Technicien', value: 'technician' },
  { label: 'Association', value: 'association' },
  { label: 'Autre', value: 'other' },
];

const entityColumns = [
  { name: 'name', label: 'Nom', field: 'name', align: 'left' as const },
  { name: 'entity_type', label: 'Type', field: 'entity_type', align: 'left' as const },
  { name: 'action_zone', label: 'Zone d\'action', field: 'action_zone', align: 'left' as const },
  { name: 'is_approved', label: 'Approuvée', field: 'is_approved', align: 'left' as const },
  { name: 'actions', label: 'Actions', align: 'right' as const },
];

const proposalColumns = [
  { name: 'entity_data.name', label: 'Nom', field: (row: EntityProposal) => row.entity_data.name, align: 'left' as const },
  { name: 'entity_data.entity_type', label: 'Type', field: (row: EntityProposal) => row.entity_data.entity_type, align: 'left' as const },
  { name: 'users.full_name', label: 'Proposé par', field: (row: EntityProposal) => row.users?.full_name, align: 'left' as const },
  { name: 'actions', label: 'Actions', align: 'right' as const },
];

onMounted(async () => {
  await entitiesStore.fetchEntities();
  await entitiesStore.fetchProposals();
  entities.value = entitiesStore.entities;
  proposals.value = entitiesStore.proposals;
});

const editEntity = (entity: Entity): void => {
  editingEntity.value = { ...entity };
  showEditDialog.value = true;
};

const saveEntity = async (): Promise<void> => {
  loading.value = true;
  const success = await entitiesStore.updateEntity(editingEntity.value.id!, editingEntity.value as Entity);
  if (success) {
    showEditDialog.value = false;
    $q.notify({ type: 'positive', message: 'Entité mise à jour !' });
  }
  loading.value = false;
};

const confirmDelete = (id: string): void => {
  confirmDialog.value = {
    title: 'Supprimer une entité',
    message: 'Êtes-vous sûr de vouloir supprimer cette entité ?',
    action: 'deleteEntity',
    params: id,
  };
  showConfirmDialog.value = true;
};

const confirmApprove = (proposal: EntityProposal): void => {
  confirmDialog.value = {
    title: 'Approuver une proposition',
    message: `Approuver la proposition "${proposal.entity_data.name}" ?`,
    action: 'approveProposal',
    params: proposal,
  };
  showConfirmDialog.value = true;
};

const confirmReject = (proposal: EntityProposal): void => {
  confirmDialog.value = {
    title: 'Rejeter une proposition',
    message: `Rejeter la proposition "${proposal.entity_data.name}" ?`,
    action: 'rejectProposal',
    params: proposal,
  };
  showConfirmDialog.value = true;
};

const confirmAction = async (): Promise<void> => {
  const { action, params } = confirmDialog.value;
  loading.value = true;

  if (action === 'deleteEntity') {
    await entitiesStore.deleteEntity(params);
    $q.notify({ type: 'positive', message: 'Entité supprimée !' });
  } else if (action === 'approveProposal') {
    await entitiesStore.approveProposal(params.id, params.entity_data);
    $q.notify({ type: 'positive', message: 'Proposition approuvée !' });
  } else if (action === 'rejectProposal') {
    const feedback = prompt('Pourquoi rejeter cette proposition ?');
    if (feedback) {
      await entitiesStore.rejectProposal(params.id, feedback);
      $q.notify({ type: 'positive', message: 'Proposition rejetée.' });
    }
  }

  await entitiesStore.fetchEntities();
  await entitiesStore.fetchProposals();
  entities.value = entitiesStore.entities;
  proposals.value = entitiesStore.proposals;

  loading.value = false;
};
</script>