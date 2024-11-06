import { supabase } from "../../services/supabaseClient";
import { faker } from "@faker-js/faker";
import { generateTimeSlot } from "../utils/helpers";

const getMonthlyInterval = (date: Date) => {
  const startDate = new Date(date);
  startDate.setDate(1);
  
  const endDate = new Date(date);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0);
  
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
    const [
      { data: personals }, 
      { data: locals }, 
      { data: materials },
      { data: events }
    ] = await Promise.all([
      supabase.from('personal').select('id'),
      supabase.from('local').select('id'),
      supabase.from('material').select('id'),
      supabase.from('event').select('id')
    ]);

    const exceptions: any[] = [];
    
    // Générer des disponibilités pour les services à partir de décembre 2024
    const startDate = new Date('2024-12-01');
    const numberOfMonths = 12;
    
    for (let i = 0; i < numberOfMonths; i++) {
      const currentDate = new Date(startDate);
      currentDate.setMonth(startDate.getMonth() + i);
      
      const formattedDate = currentDate.toISOString().split('T')[0];
      const { startdate, enddate } = getMonthlyInterval(currentDate);
      const dayOfWeek = getDayOfWeek(currentDate);

      const generateServiceAvailability = (serviceId: number, serviceType: string) => {
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
        ...personals?.map(p => generateServiceAvailability(p.id, 'personal')) || [],
        ...locals?.map(l => generateServiceAvailability(l.id, 'local')) || [],
        ...materials?.map(m => generateServiceAvailability(m.id, 'material')) || []
      ]
        .filter(Boolean)
        .forEach(exception => exceptions.push(exception));
    }

    // Générer des disponibilités pour les événements
    if (events) {
      for (const event of events) {
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + faker.number.int({ min: 1, max: 30 }));
        const { start, end } = generateTimeSlot();
        
        exceptions.push({
          event_id: event.id,
          date: eventDate.toISOString().split('T')[0],
          start,
          end,
          daysofweek: getDayOfWeek(eventDate),
          statusday: 'available'
        });
      }
    }

    const { error } = await supabase.from('availability').insert(exceptions);
    if (error) throw error;

    console.log('✅ Disponibilités générées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des disponibilités:', error);
    throw error;
  }
};