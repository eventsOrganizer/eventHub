import { supabase } from '../../../services/supabaseClient';
import { format, differenceInHours } from 'date-fns';

export const handleConfirm = async (
  personalId: number,
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
        personal_id: personalId,
        startdate: selectedDate,
        enddate: selectedDate,
        statusday: 'exception',
        start: startHour,
        end: endHour
      })
      .select()
      .single();

    if (availabilityError) throw availabilityError;

    const { error: personalUserError } = await supabase
      .from('personal_user')
      .insert({
        personal_id: personalId,
        user_id: userId,
        availability_id: availabilityData.id,
        status: 'pending'
      });

    if (personalUserError) throw personalUserError;

    const { error: requestError } = await supabase
      .from('request')
      .insert({
        user_id: userId,
        personal_id: personalId,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

    if (requestError) throw requestError;

    return true;
  } catch (error) {
    console.error('Error making service request:', error);
    throw error;
  }
};