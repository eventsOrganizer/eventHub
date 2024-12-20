import { supabase } from './supabaseClient';
import { LocalService as ImportedLocalService } from './serviceTypes';

export type LocalComment = {
  id: number;
  details: string;
  user_id: string;
  created_at: string;
  local_id: number;
};

export type LocalService = {
  id: number;
  name: string;
  priceperhour: number;
  details: string;
  user_id: string;
  subcategory?: { 
    name: string;
    category?: {
      name: string;
    };
  };
  media?: { url: string }[];
  imageUrl?: string;
  startdate: string;
  enddate: string;
  availability: Array<{
    date: string;
    statusday: 'available' | 'reserved' | 'exception';
  }>;
  comment: LocalComment[];
  like: Array<{ user_id: string }>;
  order: Array<{
    user_id: string;
    ticket_id: string;
  }>;
  request: Array<{
    user_id: string;
    status: string;
  }>;
  review: Array<{
    user_id: string;
    rate: number;
  }>;
  location?: {
    latitude: number | null;
    longitude: number | null;
  };
};

export type LocalServiceRequest = {
  requestData: {
    id: number;
    user_id: string;
    local_id: number;
    status: string;
    created_at: string;
    hours: number;
    total_price: number;
    deposit_amount: number;
  };
  depositAmount: number;
};

export const makeLocalServiceRequest = async (localId: number, availabilityId: number, hours: number): Promise<{ requestData: any; depositAmount: number } | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) throw new Error('User not authenticated');

    const { data: localData, error: localError } = await supabase
      .from('local')
      .select('priceperhour')
      .eq('id', localId)
      .single();
    if (localError) throw localError;

    const totalPrice = localData.priceperhour * hours;
    const depositAmount = totalPrice * 0.25; // 25% deposit

    const { data, error } = await supabase
      .from('request')
      .insert({
        user_id: userData.user.id,
        local_id: localId,
        status: 'pending',
        created_at: new Date().toISOString(),
        hours: hours,
        total_price: totalPrice,
        deposit_amount: depositAmount
      })
      .select()
      .single();

    if (error) throw error;
    return { requestData: data, depositAmount };
  } catch (error) {
    console.error('Error making local service request:', error);
    return null;
  }
};

export const initiateLocalPayment = async (requestId: number, amount: number) => {
  const FLOUCI_APP_TOKEN = "4c1e07ef-8533-4e83-bbeb-7f61c0b21931";
  const FLOUCI_APP_SECRET = "ee9d6f08-30c8-4dbb-8578-d51293ff2535";

  try {
    const response = await fetch('https://api.flouci.com/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLOUCI_APP_TOKEN}`
      },
      body: JSON.stringify({
        app_token: FLOUCI_APP_TOKEN,
        app_secret: FLOUCI_APP_SECRET,
        amount: amount,
        accept_url: `https://yourapp.com/payment-success?requestId=${requestId}`,
        cancel_url: `https://yourapp.com/payment-cancel?requestId=${requestId}`,
        decline_url: `https://yourapp.com/payment-decline?requestId=${requestId}`,
      })
    });

    const paymentData = await response.json();
    return paymentData;
  } catch (error) {
    console.error('Error initiating Flouci payment:', error);
    return null;
  }
};

export const fetchLocalServices = async (): Promise<ImportedLocalService[]> => {
  try {
    console.log('Fetching local services...');
    const { data, error } = await supabase
      .from('local')
      .select(`
        *,
        subcategory (
          name,
          category (
            name
          )
        ),
        media (url),
        like (user_id),
        review (user_id, rate),
        location (latitude, longitude),
        availability (start, end, daysofweek, date) // Ensure availability is fetched
      `)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching local services:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No services found in the database');
      return [];
    }

    console.log(`Found ${data.length} services`);
    return data.map((service: any) => ({
      ...service,
      imageUrl: service.media && service.media.length > 0
        ? service.media[0].url
        : 'https://via.placeholder.com/150',
      location: service.location ? {
        latitude: parseFloat(service.location.latitude),
        longitude: parseFloat(service.location.longitude)
      } : null,
      availability: service.availability || [] // Ensure availability is processed
    }));
  } catch (error) {
    console.error('Unexpected error fetching local services:', error);
    return [];
  }
};

interface Comment {
  details: string;
  user_id: string;
  user: { username: string };
}

export const fetchLocalDetail = async (id: number): Promise<ImportedLocalService | null> => {
  try {
    const { data, error } = await supabase
      .from('local')
      .select(`
        *,
        subcategory (
          name,
          category (
            name
          )
        ),
        media (url),
        availability (start, end, daysofweek, date),
        comment (
          details,
          user_id,
          user (username)
        ),
        like (user_id),
        order (user_id, ticket_id),
        request (user_id, status),
        review (user_id, rate),
        location (latitude, longitude)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    console.log('Fetched local detail:', data);

    const transformedData = {
      ...data,
      imageUrl: data.media && data.media.length > 0
        ? data.media[0].url
        : 'https://via.placeholder.com/150',
      comments: data.comment || [],
      likes: data.like || [],
      availability: data.availability || [],
      location: data.location ? {
        latitude: parseFloat(data.location.latitude),
        longitude: parseFloat(data.location.longitude)
      } : null,
      reviewCount: data.review ? data.review.length : 0
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching local detail:', error);
    return null;
  }
};

export const toggleLikeLocal = async (localId: number, userId: string) => {
    try {
      // Check if the user has already liked this local service
      const { data: existingLike, error: fetchError } = await supabase
        .from('like')
        .select('*')
        .eq('local_id', localId)
        .eq('user_id', userId)
        .single();
  
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
  
      // If user already liked, delete the like (unlike)
      if (existingLike) {
        const { error: deleteError } = await supabase
          .from('like')
          .delete()
          .eq('id', existingLike.id);
  
        if (deleteError) {
          throw deleteError;
        }
        return false; // Unlike successful
      }
  
      // If not liked, insert a new like
      const { error: insertError } = await supabase
        .from('like')
        .insert([{ local_id: localId, user_id: userId }]);
  
      if (insertError) {
        throw insertError;
      }
  
      return true; // Like successful
    } catch (error) {
      console.error('Error toggling like:', error);
      return null;
    }
  };

// New function to fetch personal local services
export const fetchPersonalLocalServices = async (userId: string): Promise<ImportedLocalService[]> => {
  try {
    const { data, error } = await supabase
      .from('local')
      .select(`
        *,
        subcategory (
          name,
          category (
            name
          )
        ),
        media (url),
        location (latitude, longitude)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return data as ImportedLocalService[];
  } catch (error) {
    console.error('Error fetching personal local services:', error);
    return [];
  }
};

export const addLocalReview = async (localId: number, userId: string, rating: number): Promise<boolean> => {
  try {
    // Insert the review into the review table
    const { error: insertError } = await supabase
      .from('review')
      .insert({
        local_id: localId,
        user_id: userId,
        rate: rating,
      });

    if (insertError) throw insertError;

    // No need to update review_count since it doesn't exist
    // Simply return true after inserting the review
    return true;
  } catch (error) {
    console.error('Error adding local review:', error);
    return false;
  }
};

// New function to fetch comments for local services
export const fetchLocalComments = async (localId: number): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('comment')
      .select(`
        details,
        user_id,
        user (username)
      `)
      .eq('local_id', localId);

    if (error) throw error;

    return data.map(item => ({
      details: item.details,
      user_id: item.user_id,
      user: { username: item.user[0]?.username } // Ensure user is an object with a username
    })) as Comment[];
  } catch (error) {
    console.error('Error fetching local comments:', error);
    return [];
  }
};
