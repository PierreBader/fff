<template>
    <q-layout view="lHh lpR fFf">
        <q-header reveal elevated class="bg-primary text-white">
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                    </q-avatar>
                    FritzFroschFondue
                </q-toolbar-title>

                <locale-selecter />

                <div v-if="authStore.user">
                    <q-btn flat label="Déconnexion" @click="authStore.signOut()" to="/login" />
                </div>
                <div v-else>
                    <q-btn flat label="Connexion" to="/login" />
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer show-if-above v-model="leftDrawerOpen" side="left" class="bg-grey-2" elevated>
            <q-list v-if="authStore.user">
                <q-item-label header>Actions</q-item-label>

                <q-item clickable to="/entities">
                    <q-item-section avatar>
                        <q-icon name="school" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Entités</q-item-label>
                        <q-item-label caption>Le Tableau Excel©</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable to="/propose">
                    <q-item-section avatar>
                        <q-icon name="chat" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Proposer</q-item-label>
                        <q-item-label caption>une nouvelle entité</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable to="/admin">
                    <q-item-section avatar>
                        <q-icon name="manage_accounts" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Admin</q-item-label>
                        <q-item-label caption>Gérer les propositions d'entité</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import LocaleSelecter from 'src/components/LocaleSelecter.vue';
import { useAuthStore } from '../stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
