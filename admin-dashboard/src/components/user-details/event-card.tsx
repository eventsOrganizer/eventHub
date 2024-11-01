import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Calendar as CalendarIcon, Lock as LockIcon, Lock as UnlockIcon, Info as InfoIcon } from '@phosphor-icons/react';

interface EventCardProps {
  event: {
    id: number;
    type: string;
    privacy: boolean;
    details: string;
    name: string;
    media: { url: string }[];
    subcategory: string | { name: string };
    date: string;
  };
}

export function EventCard({ event }: EventCardProps): React.JSX.Element {
  return (
    <Card sx={{ maxWidth: 345 }}>
      {event.media[0]?.url && (
        <CardMedia
          component="img"
          height="140"
          image={event.media[0].url}
          alt={event.name}
        />
      )}
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography gutterBottom variant="h5" component="div">
            {event.name}
          </Typography>
          <Box sx={{ 
            backgroundColor: 'primary.main', 
            color: 'white', 
            borderRadius: '4px', 
            padding: '0.25rem 0.5rem', 
            display: 'inline-block',
            textAlign: 'center',
            boxShadow: 1,
            opacity: 0.8
          }}>
            <Typography variant="body2">
               {event.id}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <CalendarIcon style={{ marginRight: 8 }} />
          <Typography variant="body2" color="text.secondary">
            Subcategory: {typeof event.subcategory === 'string' ? event.subcategory : event.subcategory?.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <InfoIcon style={{ marginRight: 8 }} />
          <Typography variant="body2" color="text.secondary">
            Type: {event.type}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          {event.privacy ? <LockIcon style={{ marginRight: 8 }} /> : <UnlockIcon style={{ marginRight: 8 }} />}
          <Typography variant="body2" color="text.secondary">
            Privacy: {event.privacy ? 'Private' : 'Public'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <InfoIcon style={{ marginRight: 8 }} />
          <Typography variant="body2" color="text.secondary">
            Details: {event.details}
          </Typography>
        </Box>
        
      </CardContent>
    </Card>
  );
}