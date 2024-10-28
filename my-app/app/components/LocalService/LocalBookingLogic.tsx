import { supabase } from '../../services/supabaseClient';
import { format, differenceInHours } from 'date-fns';

export const handleLocalConfirm = async (
  localId: number,
  userId: string,
  selectedDate: string,
  startHour: string,
  endHour: string
) => {
  try {
    const startDateTime = new Date(`${selectedDate}T${startHour}:00`);
    const endDateTime = new Date(`${selectedDate}T${endHour}:00`);
    const hours = differenceInHours(endDateTime, startDateTime);

    if (hours <= 0) {
      throw new Error("End time must be after start time.");
    }

    const { data: availabilityData, error: availabilityError } = await supabase
      .from('availability')
      .insert({
        date: selectedDate,
        daysofweek: format(new Date(selectedDate), 'EEEE').toLowerCase(),
        local_id: localId,
        startdate: selectedDate,
        enddate: selectedDate,
        statusday: 'exception',
        start: startHour,
        end: endHour
      })
      .select()
      .single();

    if (availabilityError) throw availabilityError;

    const { error: localUserError } = await supabase
      .from('local_user')
      .insert({
        local_id: localId,
        user_id: userId,
        availability_id: availabilityData.id,
        status: 'pending'
      });

    if (localUserError) throw localUserError;

    const { error: requestError } = await supabase
      .from('request')
      .insert({
        user_id: userId,
        local_id: localId,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

    if (requestError) throw requestError;

    return true;
  } catch (error) {
    console.error('Error making local service request:', error);
    throw error;
  }
};