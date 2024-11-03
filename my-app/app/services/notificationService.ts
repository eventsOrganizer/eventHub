import { supabase } from './supabaseClient';

export interface NotificationData {
  user_id: string;
  title: string;
  message: string,
  type: 'request' | 'response' | 'payment' | 'ticket' = 'request',
  related_id?: number;
}

export const createNotification = async (data: NotificationData): Promise<boolean> => {
  try {
    if (!data.user_id) {
      console.error('Missing required notification data:', data);
      return false;
    }

    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: data.user_id,
        title: data.title,
        message: data.message,
        type: data.type,
        related_id: data.related_id,
        created_at: new Date().toISOString(),
        is_read: false
      });

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

export const sendRequestNotification = async (
  serviceOwnerId: string,
  requesterId: string,
  requesterName: string,
  serviceName: string,
  requestId: number
): Promise<boolean> => {
  if (!serviceOwnerId) {
    console.error('Service owner ID is missing for notification');
    return false;
  }

  return await createNotification({
    user_id: serviceOwnerId,
    title: "New service request",
    message: `${requesterName} sent you a request for your service '${serviceName}'`,
    type: 'request',
    related_id: requestId
  });
};

export const sendResponseNotification = async (
  userId: string,
  requestId: number,
  status: 'accepted' | 'refused',
  serviceName: string,
  serviceOwnerName: string
): Promise<boolean> => {
  const statusText = status === 'accepted' ? 'accepted' : 'refused';
  return createNotification({
    user_id: userId,
    title: "Request update",
    message: `Your request for '${serviceName}' has been ${statusText} by ${serviceOwnerName}`,
    type: 'response',
    related_id: requestId
  });
};

export const sendPaymentNotification = async (
  serviceOwnerId: string,
  requestId: number,
  userName: string,
  serviceName: string
): Promise<boolean> => {
  if (!serviceOwnerId) {
    console.error('Service owner ID is missing for payment notification');
    return false;
  }

  return createNotification({
    user_id: serviceOwnerId,
    title: "Payment received",
    message: `${userName} paid for your service '${serviceName}'`,
    type: 'payment',
    related_id: requestId
  });
};