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
        type: 'payment',
        // Remove related_id since it's not a request
        // related_id: orderId  // This was causing the error
      });
    } catch (error) {
      console.error('Error creating ticket purchase notification:', error);
      return false;
    }
  };
const handleEventCreationNotification = async (eventId: number, creatorId: string) => {
  try {
    console.log('Starting event creation notification process...', { eventId, creatorId });
    
    // Get event details and creator name
    const { data: eventData, error: eventError } = await supabase
      .from('event')
      .select(`
        name,
        user:user_id (
          firstname,
          lastname
        )
      `)
      .eq('id', eventId)
      .single();

    if (eventError) {
      console.error('Error fetching event details:', eventError);
      throw eventError;
    }
    console.log('Event details fetched:', eventData);

    const creatorName = `${eventData.user.firstname} ${eventData.user.lastname}`;

    // Get all followers of the creator
    const { data: followers, error: followerError } = await supabase
      .from('follower')
      .select('follower_id')
      .eq('following_id', creatorId);

    if (followerError) {
      console.error('Error fetching followers:', followerError);
      throw followerError;
    }
    console.log('Followers fetched:', followers?.length || 0, 'followers found');

    if (!followers || followers.length === 0) {
      console.log('No followers found, skipping notification creation');
      return true;
    }

    // Create notifications for all followers
    console.log('Creating notifications for followers...');
    const notificationPromises = followers.map(follower => {
      console.log('Creating notification for follower:', follower.follower_id);
      return createNotification({
        user_id: follower.follower_id,
        title: 'New Event Available',
        message: `${creatorName} has created a new event: ${eventData.name}`,
        type: 'request'
      });
    });

    const results = await Promise.all(notificationPromises);
    console.log('Notification creation results:', results);
    
    return true;
  } catch (error) {
    console.error('Error creating event creation notifications:', error);
    return false;
  }
};

  return {
    handleEventRequestNotification,
    handleTicketPurchaseNotification,
    handleNewEventJoinRequest,
    handleEventCreationNotification
  };
};