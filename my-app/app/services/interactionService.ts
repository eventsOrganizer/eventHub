import { supabase } from './supabaseClient';

export const addComment = async (personalId: number, userId: string, comment: string) => {
  try {
    const { data, error } = await supabase
      .from('comment')
      .insert({ personal_id: personalId, user_id: userId, details: comment });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

export const toggleLike = async (personalId: number) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) throw new Error('User not authenticated');

    const { data: existingLike, error: fetchError } = await supabase
      .from('like')
      .select('*')
      .eq('personal_id', personalId)
      .eq('user_id', userData.user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('like')
        .delete()
        .eq('personal_id', personalId)
        .eq('user_id', userData.user.id);

      if (deleteError) throw deleteError;
      return false;
    } else {
      const { error: insertError } = await supabase
        .from('like')
        .insert({ personal_id: personalId, user_id: userData.user.id });

      if (insertError) throw insertError;
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return null;
  }
};