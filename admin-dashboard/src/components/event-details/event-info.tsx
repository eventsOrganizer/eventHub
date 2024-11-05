import * as React from 'react';
import { Card, CardContent, Typography, Avatar, Stack, Box, Button } from '@mui/material';

interface EventInfoProps {
  event: {
    id: number;
    type: string;
    privacy: boolean;
    details: string;
    name: string;
    media: { url: string }[];
    subcategory: { name: string };
    user?: {
      firstname: string;
      lastname: string;
      email: string;
    };
  };
}

export function EventInfo({ event }: EventInfoProps): React.JSX.Element {
  const imageUrl = event.media.length > 0 ? event.media[0].url : '';

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', boxShadow: 3, borderRadius: 2, p: 3 }}>
      <CardContent>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>{event.name}</Typography>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button variant="contained" color="primary">Buy Ticket</Button>
        </Box>
        <Box sx={{ mb: 3 }}>
          <img src={imageUrl} alt={event.name} style={{ width: '100%', borderRadius: '8px' }} />
        </Box>
        <Typography variant="h6" sx={{ mb: 1 }}>Time & Location</Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Dec 21, 2023, 8:00 pm - 9:00 pm<br />
          New York, Times Square New York
        </Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>Tickets</Typography>
        <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', p: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>Wrap Up Tour Ticket</Typography>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2">Price</Typography>
            <Typography variant="body2">From $5.00 to $10.00</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Adult</Typography>
            <Typography variant="body2">$10.00</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Child</Typography>
            <Typography variant="body2">$5.00</Typography>
          </Stack>
        </Box>
        <Typography variant="h6" sx={{ mt: 3 }}>Total: $0.00</Typography>
      </CardContent>
    </Card>
  );
}