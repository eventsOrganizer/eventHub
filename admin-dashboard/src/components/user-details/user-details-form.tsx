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

interface UserDetailsFormProps {
  user: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    age: number;
    gender: string;
    details: string;
    bio: string;
  };
}

export function UserDetailsForm({ user }: UserDetailsFormProps): React.JSX.Element {
  const [isEditable, setIsEditable] = React.useState(false);

  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
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
                  name="firstName"
                  defaultValue={user.firstname}
                  disabled={!isEditable}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput
                  label="Last name"
                  name="lastName"
                  defaultValue={user.lastname}
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
                  defaultValue={user.email}
                  disabled={!isEditable}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput
                  label="Phone number"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone}
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
                  defaultValue={user.age}
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
                  defaultValue={user.gender}
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
                  defaultValue={user.details}
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
                  defaultValue={user.bio}
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
