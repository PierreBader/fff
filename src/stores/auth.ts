import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from 'boot/supabase';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const session = ref<Session | null>(null);
    const loading = ref(true);

    const init = async () => {
        const { data } = await supabase.auth.getSession();
        session.value = data.session;
        user.value = data.session?.user ?? null;
        loading.value = false;

        supabase.auth.onAuthStateChange((_event, newSession) => {
            session.value = newSession;
            user.value = newSession?.user ?? null;
        });
    };

    const signIn = async (email: string, password: string): Promise<boolean> => {
        loading.value = true;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        loading.value = false;

        if (error) {
            console.error(error.message);
            return false;
        }

        return true;
    };

    const signUp = async (email: string, password: string, fullName: string): Promise<boolean> => {
        loading.value = true;

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName, // 👈 récupéré dans le trigger
                },
            },
        });

        loading.value = false;

        if (error) {
            console.error(error.message);
            return false;
        }

        return true;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return {
        user,
        session,
        loading,
        init,
        signIn,
        signUp,
        signOut,
    };
});
