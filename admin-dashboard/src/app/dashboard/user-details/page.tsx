"use client";

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { UserDetailsForm } from '../../../components/user-details/user-details-form';
import { UserInfo } from '../../../components/user-details/user-info';
import { supabase } from '../../../lib/supabase-client';
import { EventCard } from '../../../components/user-details/event-card';
import { ServiceCard } from '../../../components/user-details/service-card';

interface Event {
  id: number;
  type: string;
  privacy: boolean;
  details: string;
  name: string;
  media: { url: string }[];
  subcategory: string;
}

interface Service {
  id: number;
  subcategory: string;
  type: string;
  price: number;    
  name: string;
  details: string;
  startdate: string;
  enddate: string;
  percentage: number;
}

export default function UserDetailsPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [user, setUser] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [serviceSubcategoryFilter, setServiceSubcategoryFilter] = useState('');
  const [serviceSubcategories, setServiceSubcategories] = useState<string[]>([]);
  const [isDisabled, setIsDisabled] = React.useState<boolean | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (email) {
      console.log('Fetching details for:', email);
      supabase
        .from('user')
        .select(`id, firstname, lastname, age, gender, email, username, details, bio, media:media(url), disabled`)
        .eq('email', email)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching user details:', error);
          } else {
            const userData = data[0];
            const avatarUrl = userData.media?.[0]?.url ?? '';
            setUser({ ...userData, avatar: avatarUrl });
            setUserId(userData.id);
            setIsDisabled(userData.disabled);
          }
        });
    } else {
      console.warn('No email found in query parameters');
    }
  }, [email]);

  useEffect(() => {
    if (userId) {
      supabase
        .from('event')
        .select(`id, type, privacy, details, name, media:media(url), subcategory:subcategory(name)`)
        .eq('user_id', userId)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching events:', error);
          } else {
            setEvents(data);
          }
        });
    }
  }, [userId]);

  // Fetch events and subcategories logic remains unchanged...

  const handleMakeAdminClick = () => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleConfirmMakeAdmin = async () => {
    if (selectedUser) {
      try {
        const { error } = await supabase
          .from('user')
          .update({ role: 'admin' })
          .eq('id', selectedUser.id);

        if (error) {
          console.error('Error updating user role:', error);
        } else {
          console.log('User role updated to admin successfully');
        }
      } catch (error) {
        console.error('Unexpected error updating user role:', error);
      }
    }
    setIsDialogOpen(false);
  };

  const handleToggleDisable = async () => {
    if (email !== undefined) {
      try {
        const { error } = await supabase
          .from('user')
          .update({ disabled: !isDisabled })
          .eq('email', email);

        if (error) {
          console.error('Error updating user status:', error);
        } else {
          setIsDisabled(!isDisabled);
        }
      } catch (error) {
        console.error('Unexpected error updating user status:', error);
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">User Dashboard</Typography>
      </div>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="user details tabs" sx={{ display: 'flex', justifyContent: 'center', '& .MuiTab-root': { flexGrow: 1, textAlign: 'center' } }}>
        <Tab label="Details" />
        <Tab label="Events" />
        <Tab label="Services" />
      </Tabs>
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid lg={4} md={6} xs={12}>
            <UserInfo user={user} />
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 2, mr: 17 }}>
              <Button variant="contained" color={isDisabled ? 'success' : 'error'} onClick={handleToggleDisable}>
                {isDisabled ? 'Enable' : 'Disable'}
              </Button>
              <Button variant="contained" onClick={handleMakeAdminClick}>
                Make Admin
              </Button>
              <Button variant="outlined" color="error">Delete</Button>
            </Stack>
            {isDisabled && (
              <Typography variant="body2" color="red" sx={{ mt: 2, ml: 18.5 }}>
                This account is disabled.
              </Typography>
            )}
          </Grid>
          <Grid lg={8} md={6} xs={12}>
            <UserDetailsForm user={user} />
          </Grid>
        </Grid>
      )}
      {activeTab === 1 && (
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Typography variant="h5">Events</Typography>
          {/* Search and filter controls for events */}
          {/* Event cards rendering logic */}
        </Stack>
      )}
      {activeTab === 2 && (
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Typography variant="h5">Services</Typography>
          {/* Search and filter controls for services */}
          {/* Service cards rendering logic */}
        </Stack>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to make {selectedUser?.firstname} an admin?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">No</Button>
          <Button onClick={handleConfirmMakeAdmin} color="primary" autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
