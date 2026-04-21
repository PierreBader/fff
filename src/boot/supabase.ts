import { defineBoot } from '#q-app/wrappers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Les variables d'environnement VITE_SUPABASE_URL et VITE_SUPABASE_KEY sont requises.",
    );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default defineBoot(({ app }) => {
    app.provide('supabase', supabase);
});

export { supabase };
