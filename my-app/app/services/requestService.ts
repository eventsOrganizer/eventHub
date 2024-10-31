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

export const handleRequestConfirmation = async (requestId: number, type: string, serviceId: number) => {
  try {
    // 1. Get the request data to find the availability_id
    const { data: requestData, error: requestError } = await supabase
      .from('request')
      .select('availability_id')
      .eq('id', requestId)
      .single();

    if (requestError) throw requestError;

    // 2. Update request status
    const { error: updateRequestError } = await supabase
      .from('request')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (updateRequestError) throw updateRequestError;

    // 3. Update availability statusday to 'reserved'
    if (requestData?.availability_id) {
      const { error: availabilityError } = await supabase
        .from('availability')
        .update({ 
          statusday: 'reserved'  // This was missing before
        })
        .eq('id', requestData.availability_id);

      if (availabilityError) throw availabilityError;
    }

    // 4. Update personal_user status if it exists
    const { error: personalUserError } = await supabase
      .from('personal_user')
      .update({ status: 'accepted' })
      .eq('personal_id', serviceId)
      .eq('availability_id', requestData?.availability_id);

    if (personalUserError) {
      console.warn('Error updating personal_user:', personalUserError);
      // Don't throw here as this is not critical
    }

    return {
      success: true,
      title: "Success",
      message: "Request confirmed successfully",
      variant: "default"
    };
  } catch (error) {
    console.error('Error confirming request:', error);
    throw error;
  }
};

export const handleRequestRejection = async (requestId: number, type: string, serviceId: number) => {
  try {
    const { data: requestData, error: requestError } = await supabase
      .from('request')
      .select('availability_id')
      .eq('id', requestId)
      .single();

    if (requestError) throw requestError;

    const { error: updateRequestError } = await supabase
      .from('request')
      .update({ status: 'refused' })
      .eq('id', requestId);

    if (updateRequestError) throw updateRequestError;

    if (requestData?.availability_id) {
      const { error: availabilityError } = await supabase
        .from('availability')
        .update({
          statusday: 'available',
          start: null,
          end: null,
          daysofweek: null,
          startdate: null,
          enddate: null,
        })
        .eq('id', requestData.availability_id);

      if (availabilityError) throw availabilityError;
    }

    const { error: personalUserError } = await supabase
      .from('personal_user')
      .update({ status: 'refused' })
      .eq('personal_id', serviceId)
      .eq('availability_id', requestData?.availability_id);

    if (personalUserError) {
      console.warn('Error updating personal_user:', personalUserError);
    }

    return {
      success: true,
      title: "Success",
      message: "Request rejected successfully",
      variant: "default"
    };
  } catch (error) {
    console.error('Error rejecting request:', error);
    throw error;
  }
};
export const deleteRequest = async (requestId: number) => {
  try {
    const { error } = await supabase
      .from('request')
      .delete()
      .eq('id', requestId);

    if (error) throw error;

    return {
      success: true,
      title: "Success",
      message: "Request deleted successfully",
      variant: "default"
    };
  } catch (error) {
    console.error('Error deleting request:', error);
    throw error;
  }
};