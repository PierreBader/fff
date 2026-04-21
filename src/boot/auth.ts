import { defineBoot } from '#q-app/wrappers';
import { supabase } from './supabase';
import { useAuthStore } from 'stores/auth';
import { fetchUserProfile } from 'src/services/auth';

export default defineBoot(() => {
  const authStore = useAuthStore();

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const user = await fetchUserProfile();
      authStore.setUser(user);
    } else {
      authStore.setUser(null);
    }
  });
});
