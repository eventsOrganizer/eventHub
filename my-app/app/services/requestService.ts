import { supabase } from './supabaseClient';
import { RequestResult, RequestData, RequestStatus, CreateRequestData } from './requestTypes';
import { sendRequestNotification, sendResponseNotification, sendPaymentNotification } from './notificationService';

interface ServiceResponse {
  name: string;
  user: ServiceUser;
}

interface ServiceUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface ServiceDetails {
  id: number;
  name: string;
  user: ServiceUser;
}

const transformRawData = (rawData: any): RequestData => {
  if (!rawData) throw new Error('No data provided for transformation');
  if (!rawData.user) throw new Error('User data is missing');

  const userData: ServiceUser = {
    id: rawData.user.id,
    firstname: rawData.user.firstname,
    lastname: rawData.user.lastname,
    email: rawData.user.email
  };

  const transformServiceData = (serviceData: any): ServiceDetails | null => {
    if (!serviceData?.user?.[0]) return null;
    return {
      id: serviceData.id,
      name: serviceData.name,
      user: {
        id: serviceData.user[0].id,
        firstname: serviceData.user[0].firstname,
        lastname: serviceData.user[0].lastname,
        email: serviceData.user[0].email
      }
    };
  };

  return {
    id: rawData.id,
    user_id: rawData.user_id,
    created_at: rawData.created_at,
    status: rawData.status,
    is_read: rawData.is_read,
    is_action_read: rawData.is_action_read,
    payment_status: rawData.payment_status,
    user: userData,
    personal: rawData.personal ? transformServiceData(rawData.personal) || undefined : undefined,
    local: rawData.local ? transformServiceData(rawData.local) || undefined : undefined,
    material: rawData.material ? transformServiceData(rawData.material) || undefined : undefined
  };
};

const fetchRequestDetails = async (requestId: number, normalizedServiceType: string): Promise<RequestData> => {
  const { data: rawData, error } = await supabase
    .from('request')
    .select(`
      id,
      user_id,
      created_at,
      status,
      is_read,
      is_action_read,
      payment_status,
      user:user_id (
        id,
        firstname,
        lastname,
        email
      ),
      ${normalizedServiceType}:${normalizedServiceType}_id (
        id,
        name,
        user:user_id (
          id,
          firstname,
          lastname,
          email
        )
      )
    `)
    .eq('id', requestId)
    .single();

  if (error) throw error;
  if (!rawData) throw new Error('Request not found');

  return transformRawData(rawData);
};

export const createRequest = async (requestData: CreateRequestData): Promise<RequestData> => {
  try {
    const { data: newRequest, error: requestError } = await supabase
      .from('request')
      .insert(requestData)
      .select(`
        id, user_id, created_at, status, is_read, is_action_read, payment_status,
        user:user_id (id, firstname, lastname, email),
        personal:personal_id (id, name, user:user_id(id, firstname, lastname, email)),
        local:local_id (id, name, user:user_id(id, firstname, lastname, email)),
        material:material_id (id, name, user:user_id(id, firstname, lastname, email))
      `)
      .single();

    if (requestError) throw requestError;
    if (!newRequest) throw new Error('Failed to create request');

    const transformedRequest = transformRawData(newRequest);
    const service = transformedRequest.personal || transformedRequest.local || transformedRequest.material;
    
    if (!service) throw new Error('Service not found');
    if (!service.user) throw new Error('Service user not found');

    const requesterName = `${transformedRequest.user.firstname} ${transformedRequest.user.lastname}`;
    
    await sendRequestNotification(
      service.user.id,
      requestData.user_id,
      requesterName,
      service.name,
      transformedRequest.id
    );

    return transformedRequest;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

export const handleRequestConfirmation = async (requestId: number): Promise<RequestResult> => {
  try {
    const { data: requestData, error: requestError } = await supabase
      .from('request')
      .select(`
        id, user_id, status,
        user:user_id (firstname, lastname),
        personal:personal_id (name, user:user_id(id, firstname, lastname)),
        local:local_id (name, user:user_id(id, firstname, lastname)),
        material:material_id (name, user:user_id(id, firstname, lastname))
      `)
      .eq('id', requestId)
      .single();

    if (requestError || !requestData) throw new Error('Request not found');

    const service = requestData.personal || requestData.local || requestData.material;
    if (!service) throw new Error('Service not found');
    if (!service.user) throw new Error('Service user not found');

    const serviceOwnerName = `${service.user.firstname} ${service.user.lastname}`;

    const { error: updateError } = await supabase
      .from('request')
      .update({ 
        status: 'accepted' as RequestStatus,
        is_action_read: true,
        is_read: true
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    await sendResponseNotification(
      requestData.user_id,
      requestId,
      'accepted',
      service.name,
      serviceOwnerName
    );

    return {
      success: true,
      title: "Succès",
      message: "Demande confirmée avec succès",
      variant: "default"
    };
  } catch (error) {
    console.error('Error confirming request:', error);
    throw error;
  }
};

export const handleRequestRejection = async (requestId: number): Promise<RequestResult> => {
  try {
    const { data: requestData, error: requestError } = await supabase
      .from('request')
      .select(`
        id,
        user_id,
        status,
        user:user_id (
          firstname,
          lastname
        ),
        personal:personal_id (
          name,
          user:user_id (
            id,
            firstname,
            lastname
          )
        ),
        local:local_id (
          name,
          user:user_id (
            id,
            firstname,
            lastname
          )
        ),
        material:material_id (
          name,
          user:user_id (
            id,
            firstname,
            lastname
          )
        )
      `)
      .eq('id', requestId)
      .single();

    if (requestError || !requestData) throw new Error('Request not found');

    // Get the correct service data
    const service = requestData.personal || requestData.local || requestData.material;
    if (!service) throw new Error('Service not found');
    if (!service.user[0]) throw new Error('Service user not found');

    const serviceOwnerName = `${service.user[0].firstname} ${service.user[0].lastname}`;

    const { error: updateError } = await supabase
      .from('request')
      .update({ 
        status: 'refused' as RequestStatus,
        is_action_read: true,
        is_read: true
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    await sendResponseNotification(
      requestData.user_id,
      requestId,
      'refused',
      service.name,
      serviceOwnerName
    );

    return {
      success: true,
      title: "Succès",
      message: "Demande refusée avec succès",
      variant: "default"
    };
  } catch (error) {
    console.error('Error rejecting request:', error);
    throw error;
  }
};

export const handlePaymentSuccess = async (
  requestId: number,
  serviceOwnerId: string,
  userName: string,
  serviceName: string
): Promise<boolean> => {
  try {
    await sendPaymentNotification(serviceOwnerId, requestId, userName, serviceName);
    return true;
  } catch (error) {
    console.error('Error handling payment success:', error);
    return false;
  }
};

export const markRequestAsRead = async (requestId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('request')
      .update({ is_read: true })
      .eq('id', requestId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking request as read:', error);
    return false;
  }
};

export const deleteRequest = async (requestId: number): Promise<RequestResult> => {
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