import { supabase } from '../../../lib/supabase';

export const createRentalRequest = async (materialId: number, userId: string, availabilityId?: number) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabase
    .from('request')
    .insert([
      {
        user_id: userId,
        material_id: materialId,
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