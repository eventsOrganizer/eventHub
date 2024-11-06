import { supabase } from "../../services/supabaseClient";
import { faker } from "@faker-js/faker";
import { generateTimeSlot, generateDateRange } from "../utils/helpers";

const getIntervalDates = (date: Date, intervalType: 'weekly' | 'monthly' | 'yearly') => {
  const startDate = new Date(date);
  const endDate = new Date(date);
  
  switch (intervalType) {
    case 'weekly':
      startDate.setDate(date.getDate() - date.getDay());
      endDate.setDate(startDate.getDate() + 6);
      break;
    case 'monthly':
      startDate.setDate(1);
      endDate.setMonth(startDate.getMonth() + 1);
      endDate.setDate(0);
      break;
    case 'yearly':
      startDate.setMonth(0, 1);
      endDate.setMonth(11, 31);
      break;
  }
  
  return {
    startdate: startDate.toISOString().split('T')[0],
    enddate: endDate.toISOString().split('T')[0]
  };
};

const getDayOfWeek = (date: Date): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

export const generateAvailabilities = async () => {
  try {
    const availabilities = [];
    const [{ data: personals }, { data: locals }, { data: materials }] = await Promise.all([
      supabase.from('personal').select('id'),
      supabase.from('local').select('id'),
      supabase.from('material').select('id')
    ]);

    // Générer des exceptions et réservations pour les 30 prochains jours
    const exceptions: any[] = [];
    const numberOfDays = 30;
    
    for (let i = 1; i <= numberOfDays; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      const formattedDate = futureDate.toISOString().split('T')[0];
      const intervalType = faker.helpers.arrayElement(['weekly', 'monthly', 'yearly']) as 'weekly' | 'monthly' | 'yearly';
      const { startdate, enddate } = getIntervalDates(futureDate, intervalType);
      const dayOfWeek = getDayOfWeek(futureDate);

      const generateException = (serviceId: number, serviceType: string) => {
        if (faker.datatype.boolean(0.2)) {
          const { start, end } = generateTimeSlot();
          return {
            [`${serviceType}_id`]: serviceId,
            date: formattedDate,
            startdate,
            enddate,
            daysofweek: dayOfWeek,
            start,
            end,
            statusday: faker.helpers.arrayElement(['exception', 'reserved'] as const)
          };
        }
        return null;
      };

      [
        ...personals?.map(p => generateException(p.id, 'personal')) || [],
        ...locals?.map(l => generateException(l.id, 'local')) || [],
        ...materials?.map(m => generateException(m.id, 'material')) || []
      ]
        .filter(Boolean)
        .forEach(exception => exceptions.push(exception));
    }

    const { error } = await supabase.from('availability').insert(exceptions);
    if (error) throw error;

    console.log('✅ Disponibilités générées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des disponibilités:', error);
    throw error;
  }
};