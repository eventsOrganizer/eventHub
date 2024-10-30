import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface UserInfoProps {
  user: {
    firstname: string;
    lastname: string;
    avatar: string;
    city: string;
    country: string;
    timezone: string;
    age: number;
    gender: string;
    details: string;
    bio: string;
  };
}

export function UserInfo({ user }: UserInfoProps): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{`${user.firstname} ${user.lastname}`}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user.city} {user.country}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.timezone}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Age: {user.age}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Gender: {user.gender}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Details: {user.details}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Bio: {user.bio}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
