import { supabase } from './supabaseClient';
import { RequestResult, RequestData, RequestStatus } from './requestTypes';

const fetchRequestDetails = async (requestId: number, normalizedServiceType: string): Promise<RequestData> => {
  const { data, error } = await supabase
    .from('request')
    .select(`
      id,
      user_id,
      created_at,
      user:user_id (
        id,
        firstname,
        lastname
      ),
      ${normalizedServiceType}:${normalizedServiceType}_id (
        name,
        user:user_id (
          firstname,
          lastname
        )
      )
    `)
    .eq('id', requestId)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Request not found');

  return data as unknown as RequestData;
};

export const handleRequestConfirmation = async (
  requestId: number, 
  serviceType: string,
  serviceId: number
): Promise<RequestResult> => {
  try {
    const normalizedServiceType = serviceType.toLowerCase();
    const requestData = await fetchRequestDetails(requestId, normalizedServiceType);
    const serviceData = requestData[normalizedServiceType as keyof Pick<RequestData, 'personal' | 'local' | 'material'>];

    if (!serviceData) {
      throw new Error(`Service data not found for type: ${normalizedServiceType}`);
    }

    // Update availability status
    const { error: availabilityError } = await supabase
      .from('availability')
      .update({ statusday: 'reserved' })
      .eq(`${normalizedServiceType}_id`, serviceId);

    if (availabilityError) throw availabilityError;

    // Update request status and mark as read for provider
    const { error: updateError } = await supabase
      .from('request')
      .update({ 
        status: 'accepted' as RequestStatus,
        is_read: true,
        is_action_read: true // Set to true when provider takes action
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    const notificationMessage = `Your request for ${serviceData.name} has been accepted by ${serviceData.user.firstname} ${serviceData.user.lastname}`;
    
    // Create notification and set is_read to false initially
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: requestData.user_id,
        title: 'Request Accepted',
        message: notificationMessage,
        created_at: new Date().toISOString(),
        is_read: false // Initially unread for the requester
      });

    if (notificationError) throw notificationError;

    return {
      success: true,
      title: "Request Accepted",
      message: notificationMessage,
      variant: "default"
    };
  } catch (error) {
    console.error('Error confirming request:', error);
    throw error;
  }
};

export const handleRequestRejection = async (
  requestId: number, 
  serviceType: string,
  serviceId: number
): Promise<RequestResult> => {
  try {
    const normalizedServiceType = serviceType.toLowerCase();
    const requestData = await fetchRequestDetails(requestId, normalizedServiceType);
    const serviceData = requestData[normalizedServiceType as keyof Pick<RequestData, 'personal' | 'local' | 'material'>];

    if (!serviceData) {
      throw new Error(`Service data not found for type: ${normalizedServiceType}`);
    }

    // Get the personal_user entry
    const { data: personalUserData, error: fetchError } = await supabase
      .from('request')
      .select('availability_id')
      .eq('personal_id', serviceId)
      .eq('user_id', requestData.user_id);

    if (fetchError) throw fetchError;

    // Update availability status to available
    if (personalUserData && personalUserData.length > 0) {
      for (const entry of personalUserData) {
        if (entry.availability_id) {
          const { error: availabilityError } = await supabase
            .from('availability')
            .update({ 
              statusday: 'available',
              start: null,
              end: null
            })
            .eq('id', entry.availability_id);

          if (availabilityError) throw availabilityError;
        }

        // Remove the personal_user entry
        const { error: personalUserError } = await supabase
          .from('request')
          .delete()
          .eq('personal_id', serviceId)
          .eq('user_id', requestData.user_id);

        if (personalUserError) throw personalUserError;
      }
    }

    // Update request status to refused
    const { error: updateError } = await supabase
      .from('request')
      .update({ 
        status: 'refused' as RequestStatus,
        is_read: true,
        is_action_read: true // Set to true when provider takes action
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    const notificationMessage = `Your request for ${serviceData.name} has been refused by ${serviceData.user.firstname} ${serviceData.user.lastname}`;
    
    // Create notification and set is_read to false initially
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: requestData.user_id,
        title: 'Request Refused',
        message: notificationMessage,
        created_at: new Date().toISOString(),
        is_read: false // Initially unread for the requester
      });

    if (notificationError) throw notificationError;

    return {
      success: true,
      title: "Request Refused",
      message: notificationMessage,
      variant: "destructive"
    };
  } catch (error) {
    console.error('Error refusing request:', error);
    throw error;
  }
};
