import { supabase } from '../../services/supabaseClient';

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('event')
    .select(`
      *,
      subcategory (
        id,
        name,
        category (
          id,
          name
        )
      ),
      location (id, longitude, latitude),
      availability (id, start, end, daysofweek, date),
      media (id, url)
    `);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};