"use client";

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';

import { ServiceInfo } from '@/components/service-details/local-info';
import { supabase } from '@/lib/supabase-client';

interface Service {
  id: number;
  type: string;
  privacy: boolean;
  details: string;
  name: string;
  media: { url: string }[];
  subcategory: { name: string }; // Assuming subcategory is an object with a name property
}

export default function ServiceDetailsPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('id'); 

  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    if (serviceId) {
      supabase
        .from('local')
        .select(`
          id,
          name,
          details,
          priceperhour,
          media:media(url),
          subcategory:subcategory_id(name),
          user:user_id(firstname, lastname),
          startdate,
          enddate,
          disabled
        `)
        .eq('id', serviceId)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching local details:', error);
          } else {
            console.log('Fetched local data:', data[0]); // Log the fetched local data
            setService(data[0]);
          }
        });
    }
  }, [serviceId]);

  if (!service) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Service Details</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ServiceInfo service={service} />
        </Grid>
      </Grid>
    </Stack>
  );
}