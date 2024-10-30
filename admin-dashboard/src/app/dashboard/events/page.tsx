"use client";

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function EventsPage(): React.JSX.Element {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>
      <Typography variant="body1">
        This is the Events page. Content will be added here soon.
      </Typography>
    </Container>
  );
}