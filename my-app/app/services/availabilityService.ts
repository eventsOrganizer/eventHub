import { supabase } from './supabaseClient';

export interface AvailabilityData {
  startDate: string;
  endDate: string;
  availability: Array<{
    id: number;
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
      .select('id, date, statusday')
      .eq('personal_id', personalId);

    if (availabilityError) throw availabilityError;

    return {
      startDate: personalData.startdate,
      endDate: personalData.enddate,
      availability: availabilityData.map(item => ({
        id: item.id,
        date: item.date,
        statusday: item.statusday as 'exception' | 'reserved' | 'available'
      })),
    };
  } catch (error) {
    console.error('Error fetching availability data:', error);
    throw error;
  }
};

export interface LocalAvailabilityData {
  availability: Array<{
    id: number | string;
    local_id: number;
    date?: string;
    daysofweek?: string;
    start: string;
    end: string;
    statusday?: string;
  }>;
  exceptionDates: string[];
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  interval: number;
}

export const fetchLocalAvailabilityData = async (localId: number): Promise<LocalAvailabilityData> => {
  try {
    // Récupérer d'abord les dates de début et de fin du local
    const { data: localData, error: localError } = await supabase
      .from('local')
      .select('startdate, enddate')
      .eq('id', localId)
      .single();

    if (localError) throw localError;

    // Récupérer séparément toutes les disponibilités
    const { data: availabilityData, error: availabilityError } = await supabase
      .from('availability')
      .select('*')
      .eq('local_id', localId);

    if (availabilityError) throw availabilityError;

    // Séparer les disponibilités normales et les exceptions
    const normalAvailabilities = availabilityData?.filter(item => 
      item.statusday !== 'exception'
    ) || [];
    
    const exceptionDates = availabilityData?.filter(item => 
      item.statusday === 'exception'
    ).map(item => item.date) || [];

    return {
      startDate: localData.startdate,
      endDate: localData.enddate,
      availability: normalAvailabilities,
      interval: 30,
      exceptionDates: exceptionDates
    };
  } catch (error) {
    console.error('Error fetching local availability data:', error);
    throw error;
  }
};
