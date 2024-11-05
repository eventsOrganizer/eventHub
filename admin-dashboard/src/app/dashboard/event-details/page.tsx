"use client";

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';

import { EventInfo } from '@/components/event-details/event-info';
import { supabase } from '../../../lib/supabase-client';

interface Event {
  id: number;
  type: string;
  privacy: boolean;
  details: string;
  name: string;
  media: { url: string }[];
  subcategory: string;
}

export default function EventDetailsPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id'); 

  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (eventId) {
      supabase
        .from('event')
        .select(`id, type, privacy, details, name, media:media(url), subcategory:subcategory(name)`)
        .eq('id', eventId)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching event details:', error);
          } else {
            console.log('Fetched event data:', data[0]); // Log the fetched event data
            setEvent(data[0]);
          }
        });
    }
  }, [eventId]);

  if (!event) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Event Details</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EventInfo event={event} />
        </Grid>
      </Grid>
    </Stack>
  );
}