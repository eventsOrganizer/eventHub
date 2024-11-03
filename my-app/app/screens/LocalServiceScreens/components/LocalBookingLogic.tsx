import { supabase } from '../../../services/supabaseClient';
import { differenceInHours, parse, format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const handleLocalConfirm = async (
  localId: number,
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
      throw new Error("L'heure de fin doit être après l'heure de début.");
    }

    // Récupérer les données du service local
    const { data: localData, error: localError } = await supabase
      .from('local')
      .select('startdate, enddate')
      .eq('id', localId)
      .single();

    if (localError) throw localError;

    // Insérer dans la table availability
    const { data: availabilityData, error: availabilityError } = await supabase
      .from('availability')
      .insert({
        start: startHour,
        end: endHour,
        daysofweek: format(new Date(selectedDate), 'EEEE', { locale: enUS }).toLowerCase(),
        local_id: localId,
        date: selectedDate,
        startdate: localData.startdate,
        enddate: localData.enddate,
        statusday: 'exception'
      })
      .select()
      .single();

    if (availabilityError) throw availabilityError;

    // Insérer dans la table request
    const { data: requestData, error: requestError } = await supabase
      .from('request')
      .insert({
        user_id: userId,
        status: 'pending',
        local_id: localId,
        availability_id: availabilityData.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (requestError) throw requestError;

    console.log('Service request created successfully');
    return {
      success: true,
      message: 'Demande de réservation créée avec succès'
    };
  } catch (error) {
    console.error('Error during booking:', error);
    throw error;
  }
};