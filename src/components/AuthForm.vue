<template>
  <q-card class="q-pa-md" style="max-width: 400px; margin: 0 auto;">
    <q-card-section>
      <h4 class="text-center">Connexion</h4>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="handleSubmit">
        <q-input
          v-model="email"
          label="Email"
          type="email"
          required
          class="q-mb-md"
        />
        <q-input
          v-model="password"
          label="Mot de passe"
          type="password"
          required
          class="q-mb-md"
        />
        <div class="row q-mb-md">
          <q-btn
            label="Se connecter"
            type="submit"
            color="primary"
            class="full-width"
            :loading="loading"
          />
        </div>
        <div class="row">
          <q-btn
            label="S'inscrire"
            @click="showSignUp = true"
            color="secondary"
            class="full-width"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>

  <!-- Modal d'inscription -->
  <q-dialog v-model="showSignUp">
    <q-card>
      <q-card-section>
        <h4>Inscription</h4>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="handleSignUp">
          <q-input
            v-model="fullName"
            label="Nom complet"
            required
            class="q-mb-md"
          />
          <q-input
            v-model="email"
            label="Email"
            type="email"
            required
            class="q-mb-md"
          />
          <q-input
            v-model="password"
            label="Mot de passe"
            type="password"
            required
            class="q-mb-md"
          />
          <q-btn
            label="S'inscrire"
            type="submit"
            color="primary"
            class="full-width"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref<string>('');
const password = ref<string>('');
const fullName = ref<string>('');
const showSignUp = ref<boolean>(false);
const loading = ref<boolean>(false);

const handleSubmit = async (): Promise<void> => {
  loading.value = true;
  const success = await authStore.signIn(email.value, password.value);
  if (success) {
    router.push('/entities');
  }
  loading.value = false;
};

const handleSignUp = async (): Promise<void> => {
  loading.value = true;
  const success = await authStore.signUp(email.value, password.value, fullName.value);
  if (success) {
    showSignUp.value = false;
    router.push('/entities');
  }
  loading.value = false;
};
</script>