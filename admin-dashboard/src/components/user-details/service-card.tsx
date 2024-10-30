// ServiceCard.tsx
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Clock as AccessTimeIcon, CurrencyDollar as MonetizationOnIcon, Info as InfoIcon, Calendar as DateRangeIcon, Percent as PercentIcon } from '@phosphor-icons/react';

interface ServiceCardProps {
  service: {
    id: number;
    type: string;
    priceperhour: number;
    name: string;
    details: string;
    startdate: string;
    enddate: string;
    percentage: number;
    media: { url: string }[];
    subcategory: string | { name: string };
  };
}

export function ServiceCard({ service }: ServiceCardProps): React.JSX.Element {
  const defaultImageUrl = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg'; // Replace with your default image URL

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={service.media[0]?.url || defaultImageUrl}
        alt={service.name}
      />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography gutterBottom variant="h5" component="div">
            {service.name}
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
              ID: {service.id}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <AccessTimeIcon style={{ marginRight: 8 }} />
          <Typography variant="body2" color="text.secondary">
            Type: {service.type}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <MonetizationOnIcon style={{ marginRight: 8 }} />
          <Typography variant="body2" color="text.secondary">
            Price: ${service.priceperhour}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <InfoIcon style={{ marginRight: 8 }} />
          <Typography variant="body2" color="text.secondary">
            Details: {service.details}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <DateRangeIcon style={{ marginRight: 8 }} />
          <Typography variant="body2" color="text.secondary">
            Date: {service.startdate} to {service.enddate}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <PercentIcon style={{ marginRight: 8 }} />
          <Typography variant="body2" color="text.secondary">
            Percentage: {service.percentage}%
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Subcategory: {typeof service.subcategory === 'string' ? service.subcategory : service.subcategory.name}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
