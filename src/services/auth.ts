import { supabase } from 'boot/supabase';
import type { User } from 'src/components/types';

export async function fetchUserProfile(): Promise<User | null> {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const authUser = session?.user;
    if (!authUser) return null;

    const { data, error } = await supabase.from('users').select('*').eq('id', authUser.id).single();

    if (error) {
        console.error('Erreur fetchUserProfile:', error);
        return null;
    }

    return data as User;
}
