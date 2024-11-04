import * as React from 'react';
import { Card, CardContent, Typography, Avatar, Stack } from '@mui/material';

interface EventInfoProps {
  event: {
    id: number;
    type: string;
    privacy: boolean;
    details: string;
    name: string;
    media: { url: string }[];
    subcategory: { name: string }; // Adjusted to reflect potential object structure
  };
}

export function EventInfo({ event }: EventInfoProps): React.JSX.Element {
  console.log('EventInfo received event:', event); // Log the event prop

  const imageUrl = event.media.length > 0 ? event.media[0].url : '';

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={imageUrl} alt={event.name} sx={{ width: 56, height: 56 }} />
          <Typography variant="h5">{event.name}</Typography>
        </Stack>
        <Typography variant="body1">Type: {event.type}</Typography>
        <Typography variant="body1">Privacy: {event.privacy ? 'Private' : 'Public'}</Typography>
        <Typography variant="body1">Details: {event.details}</Typography>
        <Typography variant="body1">Subcategory: {event.subcategory.name}</Typography> {/* Access the name property */}
      </CardContent>
    </Card>
  );
}