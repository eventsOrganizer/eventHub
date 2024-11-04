"use client";

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';

import { MaterialServiceInfo } from '@/components/service-details/material-info';
import { supabase } from '@/lib/supabase-client';

interface Service {
  id: number;
  type: string;
  privacy: boolean;
  details: string;
  name: string;
  media: { url: string }[];
  category: { name: string };
}

export default function MaterialServiceDetailsPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('id'); 

  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    if (serviceId) {
      supabase
        .from('service')
        .select(`id, type, privacy, details, name, media:media(url), category:category(name)`)
        .eq('id', serviceId)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching service details:', error);
          } else {
            console.log('Fetched service data:', data[0]);
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
      <Typography variant="h4">Material Service Details</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MaterialServiceInfo service={service} />
        </Grid>
      </Grid>
    </Stack>
  );
}