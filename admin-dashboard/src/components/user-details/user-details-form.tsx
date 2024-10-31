import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { supabase } from '../../lib/supabase-client';

interface UserDetailsFormProps {
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    age: number;
    gender: string;
    details: string;
    bio: string;
  };
}

export function UserDetailsForm({ user }: UserDetailsFormProps): React.JSX.Element {
  const [isEditable, setIsEditable] = React.useState(false);
  const [formData, setFormData] = React.useState(user);

  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { error } = await supabase
        .from('user')
        .update({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          username: formData.username,
          age: formData.age,
          gender: formData.gender,
          details: formData.details,
          bio: formData.bio,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user details:', error);
      } else {
        console.log('User details updated successfully');
        setIsEditable(false);
        window.location.reload(); // Reload the page
      }
    } catch (error) {
      console.error('Unexpected error updating user details:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="This user information can be edited"
          title="User Profile"
          action={
            <Stack direction="row" spacing={1}>
              <Button onClick={handleEditClick} variant="contained">
                {isEditable ? 'Cancel' : 'Edit'}
              </Button>
            </Stack>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>First name</InputLabel>
                <OutlinedInput
                  label="First name"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput
                  label="Last name"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput
                  label="Email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Username</InputLabel>
                <OutlinedInput
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Age</InputLabel>
                <OutlinedInput
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Gender</InputLabel>
                <OutlinedInput
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Details</InputLabel>
                <OutlinedInput
                  label="Details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  disabled={!isEditable}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Bio</InputLabel>
                <OutlinedInput
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  disabled={!isEditable}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit" disabled={!isEditable}>
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
