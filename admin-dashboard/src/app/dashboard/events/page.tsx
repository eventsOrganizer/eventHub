"use client";

import { useEffect, useState } from 'react';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { EventsFilters } from '../../../components/dashboard/events/events-filters';
import { EventsTable, Event } from '../../../components/dashboard/events/events-table';
import { supabase } from '../../../lib/supabase-client';
import AddCategoryModal from '../../../components/dashboard/events/event-category';

export default function EventsPage(): React.JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    type: '',
    privacy: false,
    details: '',
    category_id: '',
    subcategory_id: '',
    user_id: '',
    group_id: null,
    location: '',
    date: '',
  });
  const [typeFilter, setTypeFilter] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubcategories(selectedCategoryId);
  }, [selectedCategoryId]);

  useEffect(() => {
    fetchEventSubcategories();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('event')
      .select(`
        id,
        name,
        type,
        privacy,
        user: user_id (firstname, lastname),
        subcategory: subcategory_id (name),
        media: media (url),
        disabled
      `);

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      const formattedData = await Promise.all(data.map(async event => {
        let imageUrl = null;

        if (event.media && event.media.length > 0) {
          imageUrl = event.media[0].url;
        } else {
          const { data: albumData, error: albumError } = await supabase
            .from('album')
            .select('media (url)')
            .eq('event_id', event.id)
            .limit(1);

          if (albumError) {
            console.error('Error fetching album image:', albumError);
          } else if (albumData && albumData.length > 0) {
            imageUrl = albumData[0].media[0].url;
          }
        }

        return {
          id: event.id ?? 'N/A',
          name: event.name ?? 'N/A',
          type: event.type ?? 'N/A',
          privacy: event.privacy ?? false,
          owner: `${event.user.firstname ?? 'N/A'} ${event.user.lastname ?? 'N/A'}`,
          subcategory: event.subcategory.name ?? 'N/A',
          image: imageUrl,
          disabled: event.disabled ?? false,
        };
      }));

      setEvents(formattedData);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('category')
      .select('id, name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('category')
        .select('id')
        .eq('type', 'event');

      if (categoryError) {
        console.error('Error fetching categories:', categoryError);
        return;
      }

      const categoryIds = categoryData.map(category => category.id);

      const { data: subcategoryData, error: subcategoryError } = await supabase
        .from('subcategory')
        .select('id, name')
        .in('category_id', categoryIds);

      if (subcategoryError) {
        console.error('Error fetching subcategories:', subcategoryError);
      } else {
        setSubcategories(subcategoryData);
      }
    } catch (error) {
      console.error('Unexpected error fetching subcategories:', error);
    }
  };

  const fetchEventSubcategories = async () => {
    const { data, error } = await supabase
      .from('subcategory')
      .select(`
        id,
        name,
        category:category_id (
          type
        )
      `)
      .eq('category.type', 'event');

    if (error) {
      console.error('Error fetching event subcategories:', error);
    } else {
      setSubcategories(data.map(subcategory => ({
        id: subcategory.id,
        name: subcategory.name
      })));
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));

    if (name === 'category_id') {
      fetchSubcategories(value as string);
    }
  };

  const handleSubmit = async () => {
    const { error } = await supabase
      .from('event')
      .insert([newEvent]);

    if (error) {
      console.error('Error adding event:', error);
    } else {
      console.log('Event added successfully');
      setOpen(false);
      fetchEvents();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleDeleteEvent = async (id: string) => {
    console.log(`Attempting to delete event with id: ${id}`);
  
    try {
      const { error: eventHasUserError } = await supabase
        .from('event_has_user')
        .delete()
        .eq('event_id', id);
  
      if (eventHasUserError) throw new Error(`Error deleting related records in event_has_user: ${eventHasUserError.message}`);
  
      const { error: requestError } = await supabase
        .from('request')
        .delete()
        .eq('event_id', id);
  
      if (requestError) throw new Error(`Error deleting related records in request: ${requestError.message}`);
  
      const { error: reviewError } = await supabase
        .from('review')
        .delete()
        .eq('event_id', id);
  
      if (reviewError) throw new Error(`Error deleting related records in review: ${reviewError.message}`);
  
      const { error: savedError } = await supabase
        .from('saved')
        .delete()
        .eq('event_id', id);
  
      if (savedError) throw new Error(`Error deleting related records in saved: ${savedError.message}`);
  
      const { error: likeError } = await supabase
        .from('like')
        .delete()
        .eq('event_id', id);
  
      if (likeError) throw new Error(`Error deleting related records in like: ${likeError.message}`);
  
      const { error } = await supabase
        .from('event')
        .delete()
        .eq('id', id);
  
      if (error) throw new Error(`Error deleting event: ${error.message}`);
  
      console.log(`Event with id: ${id} deleted successfully`);
      setEvents((prevEvents) => prevEvents.filter(event => event.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEnableDisable = async (disable: boolean) => {
    try {
      const updatePromises = Array.from(selected).map(async (id) => {
        const { error } = await supabase
          .from('event')
          .update({ disabled: disable })
          .eq('id', id);

        if (error) {
          console.error('Error updating event status:', error);
        }
      });

      await Promise.all(updatePromises);
      setSelected(new Set());
      fetchEvents();
    } catch (error) {
      console.error('Unexpected error updating events:', error);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectionChange = (newSelected: Set<string>) => {
    setSelected(newSelected);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.details || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === '' || event.type === typeFilter;
    const matchesPrivacy = privacyFilter === '' || event.privacy.toString() === privacyFilter;
    const matchesSubcategory = subcategoryFilter === '' || event.subcategory === subcategoryFilter;
    const matchesStatus = statusFilter === '' || (statusFilter === 'enabled' ? !event.disabled : event.disabled);

    return matchesSearch && matchesType && matchesPrivacy && matchesSubcategory && matchesStatus;
  });

  const paginatedEvents = applyPagination(filteredEvents, page, rowsPerPage);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCategoryAdded = () => {
    fetchSubcategories();
    console.log('Category added');
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Events</Typography>
        </Stack>
        <div>
        <Button variant="contained" onClick={handleOpenModal}>
        Add Category
      </Button>
      <AddCategoryModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onCategoryAdded={handleCategoryAdded}
      />
        </div>
      </Stack>

      <EventsFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isDeleteEnabled={selected.size > 0}
        selectedEvents={Array.from(selected).map(id => events.find(event => event.id === id)).filter(Boolean)}
        onEnableDisable={handleEnableDisable}
        onDelete={() => {
          selected.forEach(id => handleDeleteEvent(id));
          setSelected(new Set());
        }}
        typeFilter={typeFilter}
        onTypeFilterChange={(e) => setTypeFilter(e.target.value as string)}
        privacyFilter={privacyFilter}
        onPrivacyFilterChange={(e) => setPrivacyFilter(e.target.value as string)}
        subcategoryFilter={subcategoryFilter}
        onSubcategoryFilterChange={(e) => setSubcategoryFilter(e.target.value as string)}
        subcategories={subcategories}
        statusFilter={statusFilter}
        onStatusFilterChange={(e) => setStatusFilter(e.target.value as string)}
      />
      <EventsTable
        count={filteredEvents.length}
        page={page}
        rows={paginatedEvents}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSelectionChange={handleSelectionChange}
        onDelete={handleDeleteEvent}
      />

      {/* Modal for Adding New Event */}
      <Modal open={open} onClose={handleClose}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', margin: 'auto', maxWidth: '500px', top: '20%', position: 'absolute', left: '50%', transform: 'translate(-50%, -20%)' }}>
          <Typography variant="h6">Add New Event</Typography>
          <TextField
            name="name"
            label="Event Name"
            fullWidth
            margin="normal"
            value={newEvent.name}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Event Type</InputLabel>
            <Select
              name="type"
              value={newEvent.type}
              onChange={handleChange}
            >
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="outdoor">Outdoor</MenuItem>
              <MenuItem value="indoor">Indoor</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category_id"
              value={newEvent.category_id}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Subcategory</InputLabel>
            <Select
              name="subcategory_id"
              value={newEvent.subcategory_id}
              onChange={handleChange}
            >
              {subcategories.map((subcategory) => (
                <MenuItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="location"
            label="Location"
            fullWidth
            margin="normal"
            value={newEvent.location}
            onChange={handleChange}
          />
          <TextField
            name="date"
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={newEvent.date}
            onChange={handleChange}
          />
          <TextField
            name="details"
            label="Event Details"
            fullWidth
            margin="normal"
            value={newEvent.details}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
        </div>
      </Modal>

      
    </Stack>
  );
}

function applyPagination(rows: Event[], page: number, rowsPerPage: number): Event[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}