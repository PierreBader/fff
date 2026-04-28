<template>
    <q-card class="q-pa-md fixed-center shadow-5" style="width: 400px; margin: 0 auto">
        <locale-selecter />
        <q-card-section>
            <h4 class="text-center">{{ t('auth.loginTitle') }}</h4>
        </q-card-section>
        <q-card-section>
            <q-form @submit.prevent="handleSubmit">
                <q-input
                    v-model="loginEmail"
                    :label="t('auth.email')"
                    type="email"
                    required
                    class="q-mb-md"
                />
                <q-input
                    v-model="loginPassword"
                    :label="t('auth.password')"
                    type="password"
                    required
                    class="q-mb-md"
                />
                <div class="row q-mb-md">
                    <q-btn
                        :label="t('auth.loginSubmit')"
                        type="submit"
                        color="primary"
                        class="full-width"
                        :loading="loading"
                    />
                </div>
                <div class="row">
                    <q-btn
                        :label="t('auth.signUp')"
                        @click="showSignUp = true"
                        color="secondary"
                        class="full-width"
                    />
                </div>
            </q-form>
        </q-card-section>
    </q-card>

    <q-dialog v-model="showSignUp">
        <q-card>
            <q-card-section>
                <h4>{{ t('auth.signUpTitle') }}</h4>
            </q-card-section>
            <q-card-section>
                <q-form @submit.prevent="handleSignUp">
                    <q-input
                        v-model="fullName"
                        :label="t('auth.fullName')"
                        required
                        class="q-mb-md"
                    />
                    <q-input
                        v-model="signupEmail"
                        :label="t('auth.email')"
                        type="email"
                        required
                        class="q-mb-md"
                    />
                    <q-input
                        v-model="signupPassword"
                        :label="t('auth.password')"
                        type="password"
                        required
                        class="q-mb-md"
                    />
                    <q-btn
                        :label="t('auth.signUp')"
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

import LocaleSelecter from '../components/LocaleSelecter.vue';

import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const router = useRouter();
const authStore = useAuthStore();

const loginEmail = ref('');
const loginPassword = ref('');

const signupEmail = ref('');
const signupPassword = ref('');

const fullName = ref('');
const showSignUp = ref(false);
const loading = ref(false);

async function handleSubmit() {
    loading.value = true;
    const success = await authStore.signIn(loginEmail.value, loginPassword.value);
    if (success) {
        await router.push('/entities');
    }
    loading.value = false;
}

async function handleSignUp() {
    loading.value = true;
    const success = await authStore.signUp(signupEmail.value, signupPassword.value, fullName.value);

    if (success) {
        alert(t('auth.confirmYourMail'));
        showSignUp.value = false;
        await router.push('/entities');
    }
    loading.value = false;
}
</script>

<style scoped>
.q-card {
    border-radius: 2em;
}
</style>
