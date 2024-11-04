import * as React from 'react';
import { Card, CardContent, Typography, Avatar, Stack } from '@mui/material';

interface ServiceInfoProps {
  service: {
    id: number;
    type: string;
    privacy: boolean;
    details: string;
    name: string;
    media: { url: string }[];
    category: { name: string }; // Assuming category is an object with a name property
  };
}

export function ServiceInfo({ service }: ServiceInfoProps): React.JSX.Element {
  console.log('ServiceInfo received service:', service); // Log the service prop

  const imageUrl = service.media.length > 0 ? service.media[0].url : '';

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={imageUrl} alt={service.name} sx={{ width: 56, height: 56 }} />
          <Typography variant="h5">{service.name}</Typography>
        </Stack>
        <Typography variant="body1">Type: {service.type}</Typography>
        <Typography variant="body1">Privacy: {service.privacy ? 'Private' : 'Public'}</Typography>
        <Typography variant="body1">Details: {service.details}</Typography>
        <Typography variant="body1">Category: {service.category.name}</Typography> {/* Access the name property */}
      </CardContent>
    </Card>
  );
}