import { supabase } from '../../../services/supabaseClient';
import { differenceInHours, parse } from 'date-fns';

export const handleConfirm = async (
  personalId: number,
  userId: string,
  selectedDate: string,
  startHour: string,
  endHour: string
) => {
  try {
    const startDateTime = parse(`${selectedDate} ${startHour}`, 'yyyy-MM-dd HH:mm', new Date());
    const endDateTime = parse(`${selectedDate} ${endHour}`, 'yyyy-MM-dd HH:mm', new Date());
    const hours = differenceInHours(endDateTime, startDateTime);

    if (hours <= 0) {
      throw new Error("End time must be after start time.");
    }

    // Fetch personal data to get startdate and enddate
    const { data: personalData, error: personalError } = await supabase
      .from('personal')
      .select('startdate, enddate')
      .eq('id', personalId)
      .single();

    if (personalError) throw personalError;

    // Insert into the request table
  

   

    // Insert into the availability table
    const { data: availabilityData, error: availabilityError } = await supabase
      .from('availability')
      .insert({
        start: startHour,
        end: endHour,
        daysofweek: new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
        personal_id: personalId,
        date: selectedDate,
        startdate: personalData.startdate,
        enddate: personalData.enddate,
        statusday: 'exception'
      })
      .select()
      .single();

    if (availabilityError) throw availabilityError;
    const { data: requestData, error: requestError } = await supabase
    .from('request')
    .insert({
      user_id: userId,
      status: 'pending',
      personal_id: personalId,
      availability_id: availabilityData.id,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
    if (requestError) throw requestError;


    console.log('Service request created successfully');
    return true;
  } catch (error) {
    console.error('Error making service request:', error);
    throw error;
  }
};

const calculateHours = (startHour: string, endHour: string): number => {
  const start = new Date(`1970-01-01T${startHour}:00`);
  const end = new Date(`1970-01-01T${endHour}:00`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};