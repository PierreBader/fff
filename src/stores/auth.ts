// src/stores/auth.ts
import { defineStore } from 'pinia';
import type { User } from 'src/components/types';
import { supabase } from 'boot/supabase';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        loading: true,
    }),

    actions: {
        async signIn(email: string, password: string): Promise<boolean> {
            this.loading = true;

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            this.loading = false;

            if (error) {
                console.error(error.message);
                return false;
            }

            return true;
        },

        async signUp(email: string, password: string, fullName: string): Promise<boolean> {
            this.loading = true;

            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName, // 👈 récupéré dans le trigger
                    },
                },
            });

            this.loading = false;

            if (error) {
                console.error(error.message);
                return false;
            }

            return true;
        },

        async signOut() {
            await supabase.auth.signOut();
            this.user = null;
        },

        setUser(user: User | null) {
            this.user = user;
            this.loading = false;
        },
    },
});
