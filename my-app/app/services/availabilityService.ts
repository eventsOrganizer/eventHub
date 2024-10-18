import { supabase } from './supabaseClient';

export interface AvailabilityData {
  startDate: string;
  endDate: string;
  availability: Array<{
    date: string;
    statusday: 'exception' | 'reserved' | 'available';
  }>;
}

export const fetchAvailabilityData = async (personalId: number): Promise<AvailabilityData> => {
  try {
    const { data: personalData, error: personalError } = await supabase
      .from('personal')
      .select('startdate, enddate')
      .eq('id', personalId)
      .single();

    if (personalError) throw personalError;

    const { data: availabilityData, error: availabilityError } = await supabase
      .from('availability')
      .select('date, statusday')
      .eq('personal_id', personalId);

    if (availabilityError) throw availabilityError;

    return {
      startDate: personalData.startdate,
      endDate: personalData.enddate,
      availability: availabilityData.map(item => ({
        date: item.date,
        statusday: item.statusday as 'exception' | 'reserved' | 'available'
      })),
    };
  } catch (error) {
    console.error('Error fetching availability data:', error);
    throw error;
  }
};