"use client";

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';

import { UserDetailsForm } from '../../../components/user-details/user-details-form';
import { UserInfo } from '../../../components/user-details/user-info';
import { supabase } from '../../../lib/supabase-client';

export default function UserDetailsPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (email) {
      console.log('Fetching details for:', email);
      supabase
        .from('user')
        .select(`
          id,
          firstname,
          lastname,
          age,
          gender,
          email,
          details,
          bio,
          media:media(url)
        `)
        .eq('email', email)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching user details:', error);
          } else {
            const userData = data[0];
            const avatarUrl = userData.media?.[0]?.url ?? '';
            setUser({ ...userData, avatar: avatarUrl });
          }
        });
    } else {
      console.warn('No email found in query parameters');
    }
  }, [email]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">User Details</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <UserInfo user={user} />
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 2, mr: 12 }}>
            <Button variant="contained" color="error">Disable</Button>
            <Button variant="outlined" color="error">
              Delete
            </Button>
          </Stack>
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <UserDetailsForm user={user} />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 2 }}>
        
      </Stack>
    </Stack>
  );
}
