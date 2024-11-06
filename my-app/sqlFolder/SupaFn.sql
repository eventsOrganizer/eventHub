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



/////////////////////////






-- Function to count unseen requests by type
create or replace function count_unseen_requests(
  p_user_id uuid,
  p_request_type text
) returns integer as $$
declare
  unseen_count integer;
begin
  case p_request_type
    -- Sent event requests (only count non-pending and unseen by sender)
    when 'sent_events' then
      select count(*)
      into unseen_count
      from request r
      where r.user_id = p_user_id 
      and r.event_id is not null 
      and not r.seen_by_sender
      and r.status != 'pending';
    
    -- Received event requests (count unseen by receiver)
    when 'received_events' then
      select count(*)
      into unseen_count
      from request r
      join event e on r.event_id = e.id
      where e.user_id = p_user_id 
      and not r.seen_by_receiver;
    
    -- Sent service requests (only count non-pending and unseen by sender)
    when 'sent_services' then
      select count(*)
      into unseen_count
      from request r
      where r.user_id = p_user_id 
      and (r.material_id is not null 
           or r.local_id is not null 
           or r.personal_id is not null)
      and not r.seen_by_sender
      and r.status != 'pending';
    
    -- Received service requests (count unseen by receiver)
    when 'received_services' then
      select count(*)
      into unseen_count
      from request r
      left join material m on r.material_id = m.id
      left join local l on r.local_id = l.id
      left join personal p on r.personal_id = p.id
      where (m.user_id = p_user_id 
             or l.user_id = p_user_id 
             or p.user_id = p_user_id)
      and not r.seen_by_receiver;
    
    else
      unseen_count := 0;
  end case;
  
  return unseen_count;
end;
$$ language plpgsql;

-- Function to mark requests as seen by type
create or replace function mark_requests_as_seen(
  p_user_id uuid,
  p_request_type text
) returns void as $$
begin
  case p_request_type
    -- Mark sent requests as seen by sender
    when 'sent_events' then
      update request
      set seen_by_sender = true
      where user_id = p_user_id 
      and event_id is not null
      and status != 'pending';
    
    when 'sent_services' then
      update request
      set seen_by_sender = true
      where user_id = p_user_id 
      and (material_id is not null 
           or local_id is not null 
           or personal_id is not null)
      and status != 'pending';
    
    -- Mark received requests as seen by receiver
    when 'received_events' then
      update request r
      set seen_by_receiver = true
      from event e
      where r.event_id = e.id
      and e.user_id = p_user_id;
    
    when 'received_services' then
      update request r
      set seen_by_receiver = true
      where exists (
        select 1 from material m where r.material_id = m.id and m.user_id = p_user_id
      )
      or exists (
        select 1 from local l where r.local_id = l.id and l.user_id = p_user_id
      )
      or exists (
        select 1 from personal p where r.personal_id = p.id and p.user_id = p_user_id
      );
  end case;
end;
$$ language plpgsql;








