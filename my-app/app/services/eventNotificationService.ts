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
  // Fetch event request details
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

  // Handle new join request notifications
  const handleNewEventJoinRequest = async (requestId: number) => {
    try {
      console.log('Fetching request details for ID:', requestId);
      const details = await fetchEventRequestDetails(requestId);
      console.log('Request details:', details);
      
      const message = `${details.requesterName} has requested to join your event: ${details.eventName}`;
      console.log('Creating notification for owner:', details.eventOwnerId);
      
      const result = await createNotification(
        details.eventOwnerId,
        'New Join Request',
        message,
        'request',
        requestId
      );
      console.log('Notification creation result:', result);
    } catch (error) {
      console.error('Error creating event join request notification:', error);
    }
  };

  // Handle event request notifications (for accept/refuse)
  const handleEventRequestNotification = async (requestId: number, status: 'accepted' | 'refused') => {
    try {
      const details = await fetchEventRequestDetails(requestId);
      const message = `Your request to join ${details.eventName} has been ${status}`;
      
      await createNotification(
        details.userId,
        `Event Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message,
        'request',
        requestId
      );
    } catch (error) {
      console.error('Error creating event request notification:', error);
    }
  };

  // Handle ticket purchase notifications
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

      const eventOwnerId = data.ticket.event.user_id;
      const eventName = data.ticket.event.name;
      const buyerName = `${data.user.email} ${data.user.username}`;

      await createNotification(
        eventOwnerId,
        'New Ticket Purchase',
        `${buyerName} has purchased a ticket for your event: ${eventName}`,
        'ticket',
        orderId
      );
    } catch (error) {
      console.error('Error creating ticket purchase notification:', error);
    }
  };

  return {
    handleEventRequestNotification,
    handleTicketPurchaseNotification,
    handleNewEventJoinRequest  // Make sure this is included
  };
};