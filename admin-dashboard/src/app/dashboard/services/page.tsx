"use client";

import { useEffect, useState } from 'react';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import    LocalServices  from '../../../components/dashboard/services/local-services';
import  PersonalServices  from '../../../components/dashboard/services/personal-services';
import { MaterialServices } from '../../../components/dashboard/services/material-services';

export default function ServicesPage(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Services</Typography>
      
      <LocalServices /> 
      <PersonalServices />
      <MaterialServices />
    </Stack>
  );
}