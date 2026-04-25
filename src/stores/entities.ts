// src/stores/entities.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from 'boot/supabase';
import type { Entity, EntityProposal } from '../components/types';

export const useEntitiesStore = defineStore('entities', () => {
    const entities = ref<Entity[]>([]);
    const proposals = ref<EntityProposal[]>([]);
    const loading = ref<boolean>(false);

    const fetchEntities = async (
        filters: {
            entity_type?: string;
            action_zone?: string;
            is_approved?: boolean;
            limit?: number;
        } = {},
    ): Promise<void> => {
        loading.value = true;
        let query = supabase.from('entities').select('*, likes(count)');

        if (filters.entity_type) {
            query = query.eq('entity_type', filters.entity_type);
        }
        if (filters.action_zone) {
            query = query.ilike('action_zone', `%${filters.action_zone}%`);
        }
        if (filters.is_approved !== undefined) {
            query = query.eq('is_approved', filters.is_approved);
        }

        const { data, error } = await query;
        if (error) {
            alert(error.message);
            loading.value = false;
            return;
        }
        entities.value = data as Entity[];
        loading.value = false;
    };

    const fetchProposals = async (): Promise<void> => {
        loading.value = true;
        const { data, error } = await supabase
            .from('entity_proposals')
            .select('*, users(full_name)')
            .eq('status', 'pending');
        if (error) {
            alert(error.message);
            loading.value = false;
            return;
        }
        proposals.value = data as EntityProposal[];
        loading.value = false;
    };

    const addEntity = async (
        entityData: Omit<Entity, 'id' | 'is_approved' | 'created_at' | 'updated_at'>,
    ): Promise<boolean> => {
        const { error } = await supabase.from('entities').insert([entityData]);
        if (error) {
            alert(error.message);
            return false;
        }
        await fetchEntities();
        return true;
    };

    const updateEntity = async (id: string, entityData: Partial<Entity>): Promise<boolean> => {
        const { error } = await supabase.from('entities').update(entityData).eq('id', id);
        if (error) {
            alert(error.message);
            return false;
        }
        await fetchEntities();
        return true;
    };

    const deleteEntity = async (id: string): Promise<boolean> => {
        const { error } = await supabase.from('entities').delete().eq('id', id);
        if (error) {
            alert(error.message);
            return false;
        }
        entities.value = entities.value.filter((entity) => entity.id !== id);
        return true;
    };

    const proposeEntity = async (
        entityData: Omit<Entity, 'id' | 'is_approved' | 'created_at' | 'updated_at'>,
        proposed_by: string,
    ): Promise<boolean> => {
        console.log('Proposition', entityData, proposed_by);
        const { error } = await supabase.from('entity_proposals').insert([
            {
                entity_data: entityData,
                proposed_by: proposed_by,
                status: 'pending',
            },
        ]);
        if (error) {
            alert(error.message);
            return false;
        }
        return true;
    };

    const approveProposal = async (
        proposalId: string,
        entityData: Omit<Entity, 'id' | 'is_approved' | 'created_at' | 'updated_at'>,
    ): Promise<boolean> => {
        const { error: entityError } = await supabase.from('entities').insert([
            {
                ...entityData,
                is_approved: true,
            },
        ]);
        if (entityError) {
            alert(entityError.message);
            return false;
        }

        const { error: proposalError } = await supabase
            .from('entity_proposals')
            .update({ status: 'approved' })
            .eq('id', proposalId);
        if (proposalError) {
            alert(proposalError.message);
            return false;
        }

        await fetchEntities();
        await fetchProposals();
        return true;
    };

    const rejectProposal = async (proposalId: string, feedback: string): Promise<boolean> => {
        const { error } = await supabase
            .from('entity_proposals')
            .update({ status: 'rejected', feedback })
            .eq('id', proposalId);
        if (error) {
            alert(error.message);
            return false;
        }
        await fetchProposals();
        return true;
    };

    const likeEntity = async (entityId: string): Promise<boolean> => {
        const { error } = await supabase.from('likes').insert([{ entity_id: entityId }]);
        if (error) {
            alert(error.message);
            return false;
        }
        await fetchEntities();
        return true;
    };

    return {
        entities,
        proposals,
        loading,
        fetchEntities,
        fetchProposals,
        addEntity,
        updateEntity,
        deleteEntity,
        proposeEntity,
        approveProposal,
        rejectProposal,
        likeEntity,
    };
});
