import { supabase } from '../../lib/supabase';

export const createRentalRequest = async (materialId: number, userId: string | null, availabilityId?: number) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabase
    .from('request')
    .insert([
      {
        material_id: materialId,
        user_id: userId,
        status: 'pending',
        availability_id: availabilityId,
        created_at: new Date().toISOString(),
        is_read: false,
        is_action_read: false
      }
    ])
    .select();

  if (error) {
    console.error('Error creating rental request:', error);
    throw error;
  }

  return data;
};