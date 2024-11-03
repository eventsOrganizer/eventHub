import { supabase } from './supabaseClient';
import { createNotification } from './notificationService';

interface EventRequestNotification {
  requestId: number;
  eventId: number;
  userId: string;
  eventOwnerId: string;
  eventName: string;
  requesterName: string;
}

export const createEventNotificationSystem = () => {
  const fetchEventRequestDetails = async (requestId: number): Promise<EventRequestNotification> => {
    const { data, error } = await supabase
      .from('request')
      .select(`
        id,
        user_id,
        event_id,
        user:user_id (
          firstname,
          lastname
        ),
        event:event_id (
          name,
          user_id
        )
      `)
      .eq('id', requestId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Request not found');

    return {
      requestId: data.id,
      eventId: data.event_id,
      userId: data.user_id,
      eventOwnerId: data.event.user_id,
      eventName: data.event.name,
      requesterName: `${data.user.firstname} ${data.user.lastname}`
    };
  };

  const handleNewEventJoinRequest = async (requestId: number) => {
    try {
      const details = await fetchEventRequestDetails(requestId);
      
      return await createNotification({
        user_id: details.eventOwnerId,
        title: 'New Join Request',
        message: `${details.requesterName} has requested to join your event: ${details.eventName}`,
        type: 'request',
        related_id: requestId
      });
    } catch (error) {
      console.error('Error creating event join request notification:', error);
      return false;
    }
  };

  const handleEventRequestNotification = async (requestId: number, status: 'accepted' | 'refused') => {
    try {
      const details = await fetchEventRequestDetails(requestId);
      
      return await createNotification({
        user_id: details.userId,
        title: `Event Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your request to join ${details.eventName} has been ${status}`,
        type: 'response',
        related_id: requestId
      });
    } catch (error) {
      console.error('Error creating event request notification:', error);
      return false;
    }
  };

  const handleTicketPurchaseNotification = async (orderId: number) => {
    try {
      const { data, error } = await supabase
        .from('order')
        .select(`
          user_id,
          ticket:ticket_id (
            event:event_id (
              name,
              user_id
            )
          ),
          user:user_id (
            firstname,
            lastname
          )
        `)
        .eq('id', orderId)
        .single();
  
      if (error) throw error;
      if (!data) throw new Error('Order not found');
  
      return await createNotification({
        user_id: data.ticket.event.user_id,
        title: 'New Ticket Purchase',
        message: `${data.user.firstname} ${data.user.lastname} has purchased a ticket for your event: ${data.ticket.event.name}`,
        type: 'payment',  // Changed from 'ticket' to 'payment'
        related_id: orderId
      });
    } catch (error) {
      console.error('Error creating ticket purchase notification:', error);
      return false;
    }
  };

  return {
    handleEventRequestNotification,
    handleTicketPurchaseNotification,
    handleNewEventJoinRequest
  };
};