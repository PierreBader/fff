// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase/client';
import type { User, AuthState } from '../components/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref<boolean>(false);

  const fetchUser = async (): Promise<void> => {
    loading.value = true;
    const { data: { user: userData } } = await supabase.auth.getUser();
    user.value = userData as User | null;
    loading.value = false;
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    loading.value = true;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
      loading.value = false;
      return false;
    }
    await fetchUser();
    loading.value = false;
    return true;
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<boolean> => {
    loading.value = true;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'reader',
        },
      },
    });
    if (error) {
      alert(error.message);
      loading.value = false;
      return false;
    }
    await fetchUser();
    loading.value = false;
    return true;
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    user.value = null;
  };

  return { user, loading, fetchUser, signIn, signUp, signOut };
});