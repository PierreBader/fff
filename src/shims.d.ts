import type { SupabaseClient } from '@supabase/supabase-js';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $supabase: SupabaseClient;
  }
}
