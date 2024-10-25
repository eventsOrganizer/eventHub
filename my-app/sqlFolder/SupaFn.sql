CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 FLOAT,
  lon1 FLOAT,
  lat2 FLOAT,
  lon2 FLOAT
)
RETURNS FLOAT AS $$
DECLARE
  R CONSTANT FLOAT := 6371; -- Radius of the Earth in km
  dLat FLOAT;
  dLon FLOAT;
  a FLOAT;
  c FLOAT;
BEGIN
  dLat := radians(lat2 - lat1);
  dLon := radians(lon2 - lon1);
  a := sin(dLat/2) * sin(dLat/2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dLon/2) * sin(dLon/2);
  c := 2 * atan2(sqrt(a), sqrt(1 - a));
  RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

///////////////////////////////////////////////////////

CREATE OR REPLACE FUNCTION filter_events(
  user_lat FLOAT,
  user_lon FLOAT,
  max_distance FLOAT,
  search_name TEXT,
  input_category_id INTEGER,
  input_subcategory_id INTEGER,
  event_type TEXT,
  is_private BOOLEAN,
  min_price FLOAT,
  max_price FLOAT,
  start_date TIMESTAMP,
  end_date TIMESTAMP
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(row_to_json(t))
  INTO result
  FROM (
    SELECT
      e.id,
      e.name,
      e.details,
      e.type::TEXT,
      e.privacy,
      e.user_id,
      e.subcategory_id,
      e.group_id,
      COALESCE(l.event_distance, 0)::FLOAT AS event_distance,
      COALESCE(t.event_price, 0)::FLOAT AS event_price,
      c.name::TEXT AS category_name,
      s.name::TEXT AS subcategory_name,
      COALESCE(m.media_urls, ARRAY[]::TEXT[]) AS media_urls,
      COALESCE(l.location_data, '{}'::JSON) AS location_data,
      COALESCE(a.event_date, '1970-01-01'::TIMESTAMP) AS event_date
    FROM public.event e
    LEFT JOIN (
      SELECT 
        event_id, 
        calculate_distance(user_lat, user_lon, latitude, longitude)::FLOAT AS event_distance,
        json_build_object('latitude', latitude, 'longitude', longitude) AS location_data
      FROM public.location
    ) l ON l.event_id = e.id
    LEFT JOIN (
      SELECT event_id, COALESCE(price::FLOAT, 0) AS event_price
      FROM public.ticket
    ) t ON t.event_id = e.id
    INNER JOIN public.subcategory s ON s.id = e.subcategory_id
    INNER JOIN public.category c ON c.id = s.category_id
    LEFT JOIN (
      SELECT event_id, array_remove(array_agg(DISTINCT url), NULL) AS media_urls
      FROM public.media
      GROUP BY event_id
    ) m ON m.event_id = e.id
    LEFT JOIN (
      SELECT event_id, MIN(date) AS event_date
      FROM public.availability
      GROUP BY event_id
    ) a ON a.event_id = e.id
    WHERE 
      (search_name IS NULL OR e.name ILIKE '%' || search_name || '%')
      AND (input_category_id IS NULL OR c.id = input_category_id)
      AND (input_subcategory_id IS NULL OR e.subcategory_id = input_subcategory_id)
      AND (event_type IS NULL OR e.type = event_type)
      AND (is_private IS NULL OR e.privacy = is_private)
      AND (min_price IS NULL OR t.event_price >= min_price)
      AND (max_price IS NULL OR t.event_price <= max_price)
      AND (start_date IS NULL OR a.event_date >= start_date)
      AND (end_date IS NULL OR a.event_date <= end_date)
      AND (max_distance IS NULL OR l.event_distance <= max_distance)
    ORDER BY l.event_distance
  ) t;
  
  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql;








