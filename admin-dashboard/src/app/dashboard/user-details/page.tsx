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

import { UserDetailsForm } from '../../../components/user-details/user-details-form';
import { UserInfo } from '../../../components/user-details/user-info';
import { supabase } from '../../../lib/supabase-client';
import { EventCard } from '../../../components/user-details/event-card';
import { Event as EventType } from '../../../types/event';
import { User } from '../../../types/user';
import { searchEvents } from '../../../utils/search-events';
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

  React.useEffect(() => {
    if (email) {
      console.log('Fetching details for:', email);
      supabase
        .from('user')
        .select(`
          id,
          firstname,
          lastname,
          age,
          gender,
          email,
          username,
          details,
          bio,
          media:media(url),
          disabled
        `)
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

  React.useEffect(() => {
    if (userId) {
      supabase
        .from('event')
        .select(`
          id,
          type,
          privacy,
          details,
          name,
          media:media(url),
          subcategory:subcategory(name)
        `)
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

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('event')
        .select(`
          id,
          type,
          privacy,
          details,
          name,
          media:media(url),
          subcategory:subcategory(name)
        `);

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
      }
    };

    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from('subcategory')
        .select('name')
        .in('category_id', 
          (await supabase
            .from('category')
            .select('id')
            .eq('type', 'event')
          ).data.map(category => category.id)
        );

      if (error) {
        console.error('Error fetching subcategories:', error);
      } else {
        setSubcategories(data.map((subcategory) => subcategory.name));
      }
    };

    fetchEvents();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchServices = async () => {
      try {
        const { data: localData, error: localError } = await supabase
          .from('local')
          .select(`
            id,
            name,
            details,
            priceperhour,
            startdate,
            enddate,
            percentage,
            subcategory:subcategory(name),
            media:media(url)
          `)
          .eq('user_id', userId);

        if (localError) {
          console.error('Error fetching local services:', localError);
        }

        const { data: materialData, error: materialError } = await supabase
          .from('material')
          .select(`
            id,
            name,
            details,
            price,
            startdate,
            enddate,
            percentage,
            subcategory:subcategory(name),
            media:media(url)
          `)
          .eq('user_id', userId);

        if (materialError) {
          console.error('Error fetching material services:', materialError);
        }

        const { data: personalData, error: personalError } = await supabase
          .from('personal')
          .select(`
            id,
            name,
            details,
            priceperhour,
            startdate,
            enddate,
            percentage,
            subcategory:subcategory(name),
            media:media(url)
          `)
          .eq('user_id', userId);

        if (personalError) {
          console.error('Error fetching personal services:', personalError);
        }

        if (!localError && !materialError && !personalError) {
          const combinedServices = [
            ...localData.map(service => ({ ...service, type: 'venue' })),
            ...materialData.map(service => ({ ...service, type: 'product' })),
            ...personalData.map(service => ({ ...service, type: 'crew' })),
          ];
          setServices(combinedServices);
        }
      } catch (error) {
        console.error('Unexpected error fetching services:', error);
      }
    };

    fetchServices();
  }, [userId]);

  useEffect(() => {
    const fetchServiceSubcategories = async () => {
      if (!serviceTypeFilter) return;

      const typeToCategoryIdMap = {
        venue: 42,
        crew: 41,
        product: 43,
      };

      const categoryId = typeToCategoryIdMap[serviceTypeFilter];

      if (!categoryId) return;

      try {
        const { data, error } = await supabase
          .from('subcategory')
          .select('name')
          .eq('category_id', categoryId);

        if (error) {
          console.error('Error fetching service subcategories:', error);
        } else {
          setServiceSubcategories(data.map((subcategory) => subcategory.name));
        }
      } catch (error) {
        console.error('Unexpected error fetching service subcategories:', error);
      }
    };

    fetchServiceSubcategories();
  }, [serviceTypeFilter]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter ? event.type === typeFilter : true;
    const matchesPrivacy = privacyFilter ? event.privacy.toString() === privacyFilter : true;
    const matchesSubcategory = subcategoryFilter ? 
      (typeof event.subcategory === 'string' ? 
        event.subcategory === subcategoryFilter : 
        (event.subcategory as { name: string }).name === subcategoryFilter) 
      : true;

    return matchesSearch && matchesType && matchesPrivacy && matchesSubcategory;
  });

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = serviceTypeFilter ? service.type === serviceTypeFilter : true;
    const matchesSubcategory = serviceSubcategoryFilter ? 
      service.subcategory === serviceSubcategoryFilter : true;

    return matchesSearch && matchesType && matchesSubcategory;
  });

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
              <Button variant="outlined" color="error">
                Delete
              </Button>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <OutlinedInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              placeholder="Search events"
              startAdornment={
                <InputAdornment position="start">
                  <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                </InputAdornment>
              }
              sx={{ maxWidth: '500px' }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="outdoor">Outdoor</MenuItem>
                <MenuItem value="indoor">Indoor</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Privacy</InputLabel>
              <Select
                value={privacyFilter}
                onChange={(e) => setPrivacyFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="false">Public</MenuItem>
                <MenuItem value="true">Private</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={subcategoryFilter}
                onChange={(e) => setSubcategoryFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {subcategories.map((subcategory) => (
                  <MenuItem key={subcategory} value={subcategory}>
                    {subcategory}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Grid container spacing={3}>
            {filteredEvents.map((event: Event) => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      )}
      {activeTab === 2 && (
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Typography variant="h5">Services</Typography>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <OutlinedInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              placeholder="Search services"
              startAdornment={
                <InputAdornment position="start">
                  <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                </InputAdornment>
              }
              sx={{ maxWidth: '500px' }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="venue">Venue</MenuItem>
                <MenuItem value="crew">Crew</MenuItem>
                <MenuItem value="product">Product</MenuItem>
              </Select>
            </FormControl>
            {serviceTypeFilter && (
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={serviceSubcategoryFilter}
                  onChange={(e) => setServiceSubcategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {serviceSubcategories.map((subcategory) => (
                    <MenuItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
          <Grid container spacing={3}>
            {filteredServices.map((service: Service) => (
              <Grid item key={service.id} xs={12} sm={6} md={4}>
                <ServiceCard service={service} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      )}
    </Stack>
  );
}
