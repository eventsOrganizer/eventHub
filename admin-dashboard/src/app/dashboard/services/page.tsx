"use client";

import { useState } from 'react';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LocalServices from '../../../components/dashboard/services/local-services';
import PersonalServices from '../../../components/dashboard/services/personal-services';
import MaterialServices from '../../../components/dashboard/services/material-services';

export default function ServicesPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Services</Typography>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="services tabs">
        <Tab label="Local Services" />
        <Tab label="Personal Services" />
        <Tab label="Material Services" />
      </Tabs>
      {activeTab === 0 && <LocalServices />}
      {activeTab === 1 && <PersonalServices />}
      {activeTab === 2 && <MaterialServices />}
    </Stack>
  );
}