<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title> FritzFroschFondue </q-toolbar-title>
                <div v-if="authStore.user">
                    <q-btn flat label="Entités" to="/entities" />
                    <q-btn flat label="Proposer" to="/propose" />
                    <q-btn
                        v-if="authStore.user?.app_metadata.role === 'manager'"
                        flat
                        label="Admin"
                        to="/admin"
                    />
                    <q-btn flat label="Déconnexion" @click="authStore.signOut()" />
                </div>
                <div v-else>
                    <q-btn flat label="Connexion" to="/login" />
                </div>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

console.log(authStore.user?.app_metadata.role);
</script>
