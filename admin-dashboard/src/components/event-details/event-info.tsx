import * as React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Rating from '@mui/material/Rating';

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
    availability?: {
      date: Date;
    };
    location?: {
      latitude: number;
      longitude: number;
    };
    reviews?: { rate: number | null }[];  // rate can be null
  };
}

export function EventInfo({ event }: EventInfoProps): React.JSX.Element {
  const imageUrl = event.media.length > 0 ? event.media[0].url : '';

  return (
    <Card sx={{
      maxWidth: 1000,  // Increase max width for the side-by-side layout
      margin: 'auto',
      boxShadow: 12,  // Bold shadow for a premium feel
      borderRadius: 3,  // Smooth rounded corners
      overflow: 'hidden', // Ensures that the corners are rounded for the image
      backgroundColor: '#f5f5f5',  // Light gray background
      p: 4,
      ':hover': {
        boxShadow: 16, // Hover effect to make it pop
        transform: 'scale(1.02)',  // Subtle zoom effect on hover
        transition: 'all 0.3s ease-in-out',
      }
    }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* Image section */}
        <Box sx={{
  flex: 1,
  maxWidth: 400,  // Set a max width to control image size
  marginRight: 3,  // Add space between the image and text
  display: 'flex',  // Add flex display
  alignItems: 'center',  // Center the image vertically
  height: '100%',  // Make the container take full height of its parent
  backgroundColor: '#e0e0e0',  // Optional: Add a background color for better visibility
}}>
  <img src={imageUrl} alt={event.name} style={{
    maxWidth: '100%',  // Ensure the image does not exceed container width
    height: 'auto',  // Ensure the image height adjusts proportionally
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease-in-out',
  }} />
</Box>

        {/* Content section */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h4" sx={{
            textAlign: 'left',
            mb: 3,
            color: '#333',
            fontWeight: 700,
            fontSize: '2.5rem',
            textTransform: 'uppercase',
          }}>
            {event.name}
          </Typography>

          <Typography variant="h6" sx={{
            color: '#333',
            fontSize: '1.25rem',
            mb: 2,
            fontWeight: 500,
            textDecoration: 'underline'
          }}>
            Event Details
          </Typography>

          <Box sx={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            p: 3,
            backgroundColor: '#fff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          }}>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: '#555' }}>
              <strong>Type:</strong> {event.type}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: '#555' }}>
              <strong>Privacy:</strong> {event.privacy ? 'Private' : 'Public'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: '#555' }}>
              <strong>Details:</strong> {event.details}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: '#555' }}>
              <strong>Subcategory:</strong> {event.subcategory.name}
            </Typography>

            {event.user && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#555' }}>
                  <strong>Created by:</strong> {event.user.firstname} {event.user.lastname}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#555' }}>
                  <strong>Email:</strong> {event.user.email}
                </Typography>
              </Box>
            )}

            {event.availability && (
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: '#555' }}>
                <strong>Date:</strong> {event.availability.date.toDateString()}
              </Typography>
            )}

            {event.location && (
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: '#555' }}>
                <strong>Location:</strong> Latitude {event.location.latitude}, Longitude {event.location.longitude}
              </Typography>
            )}

            {event.reviews && event.reviews.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#333',
                  mb: 2,
                }}>
                  Reviews
                </Typography>

                {event.reviews.map((review, index) => {
                  const rate = review.rate ?? 0;

                  return (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Rating value={rate} max={5} readOnly sx={{
                        fontSize: '1.5rem',
                        color: '#FFD700',
                        '& .MuiRating-iconEmpty': {
                          color: '#e0e0e0',  // Empty stars are gray
                        },
                      }} />
                      <Typography sx={{
                        fontSize: '1rem',
                        color: rate === 0 ? '#999' : '#333',
                        textTransform: rate === 0 ? 'italic' : 'none',
                      }}>
                        {rate === 0 ? 'No Rating' : `${rate} Stars`}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
