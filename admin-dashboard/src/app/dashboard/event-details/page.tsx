"use client";

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';

import { EventInfo } from '@/components/event-details/event-info';
import { supabase } from '../../../lib/supabase-client';

// Add availability and location to the Event interface
interface Event {
    id: number;
    type: string;
    privacy: boolean;
    details: string;
    name: string;
    media: { url: string }[];
    subcategory: string;
    user?: {
      firstname: string;
      lastname: string;
      email: string;
    };
    availability?: {
      date: Date;
    };
    location?: {
      latitude: number;
      longitude: number;
    };
    reviews?: { rate: number }[]; // Add this line
  }

export default function EventDetailsPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');

  const [event, setEvent] = useState<Event | null>(null);

  // Update the supabase query to include availability and location
  // Update the supabase query to include the date field from availability
  useEffect(() => {
    if (eventId) {
      supabase
        .from('event')
        .select(`
          id, 
          type, 
          privacy, 
          details, 
          name, 
          media:media(url), 
          subcategory:subcategory(name),
          user:user!event_user_id_fkey(firstname, lastname, email),
          availability:availability(date),
          location:location(latitude, longitude),
          reviews:review(rate)
        `)
        .eq('id', eventId)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching event details:', error);
          } else {
            const eventData = data[0];
            if (eventData.availability) {
              eventData.availability.date = new Date(eventData.availability.date);
            }
            console.log('Fetched event data:', eventData);
            setEvent(eventData);
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