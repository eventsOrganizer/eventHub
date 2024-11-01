import { supabase } from './supabaseClient';

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'request' | 'response' | 'payment' | 'ticket' = 'request',
  relatedId?: number
) => {
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      created_at: new Date().toISOString(),
      is_read: false,
      type,
      related_id: relatedId
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

export const markNotificationAsRead = async (notificationId: number) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};