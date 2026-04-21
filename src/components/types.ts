// src/components/types.ts
export interface User {
    id: string;
    email: string;
    full_name?: string;
    role: 'admin' | 'reader';
    created_at?: string;
}

export interface Entity {
    id: string;
    name: string;
    description?: string;
    entity_type: 'organizer' | 'venue' | 'artist' | 'technician' | 'association' | 'other';
    contact_email?: string;
    contact_phone?: string;
    website_url?: string;
    facebook_url?: string;
    instagram_url?: string;
    youtube_url?: string;
    soundcloud_url?: string;
    cost_range?: string;
    availability?: string;
    action_zone?: string;
    lat?: number;
    lng?: number;
    is_approved: boolean;
    created_by?: string;
    created_at?: string;
    updated_at?: string;
    likes?: { count: number };
}

export interface EntityProposal {
    id: string;
    entity_data: Omit<Entity, 'id' | 'is_approved' | 'created_at' | 'updated_at'>;
    status: 'pending' | 'approved' | 'rejected';
    proposed_by: string;
    reviewed_by?: string;
    reviewed_at?: string;
    feedback?: string;
    created_at?: string;
    users?: {
        full_name: string;
    };
}

export interface Review {
    id: string;
    entity_id: string;
    user_id: string;
    rating: number;
    comment?: string;
    created_at?: string;
}

export interface Like {
    id: string;
    entity_id: string;
    user_id: string;
    created_at?: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
}

export interface EntitiesState {
    entities: Entity[];
    proposals: EntityProposal[];
    loading: boolean;
}
