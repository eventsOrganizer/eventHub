import * as React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase-client';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

interface EventDetailProps {
  eventId: string;
}

export function EventDetail({ eventId }: EventDetailProps): React.JSX.Element {
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event details:', error);
      } else {
        setEvent(data);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={event.media?.[0]?.url || 'default-image-url'}
        alt={event.name}
      />
      <CardContent>
        <Typography variant="h5">{event.name}</Typography>
        <Typography variant="body2">Type: {event.type}</Typography>
        <Typography variant="body2">Privacy: {event.privacy ? 'Private' : 'Public'}</Typography>
        <Typography variant="body2">Details: {event.details}</Typography>
      </CardContent>
    </Card>
  );
}