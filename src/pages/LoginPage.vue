<template>
    <q-page class="q-pa-md">
        <RadarBackground ref="radar" />
        <div :class="{ hidden: animating }">
            <AuthForm @login.once="login" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AuthForm from "../components/AuthForm.vue";
import RadarBackground from "../components/RadarBackground.vue";
//import { useRouter } from "vue-router";

//const router = useRouter();

const radar = ref<InstanceType<typeof RadarBackground> | null>(null);

const animating = ref(false);

async function login() {
    animating.value = true;

    console.log("Hopla login");

    try {
        await radar.value?.playLogoAnimation();

        console.log("Film terminé");

        //await router.push("/entities");
    } catch (error) {
        console.error(error);
    } finally {
        animating.value = false;
    }
}
</script>
<style lang="css" scoped>
.hidden {
    opacity: 0;
    transition: all 0.5s;
}
</style>
