import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { supabase } from '../../lib/supabase-client';

interface UserInfoProps {
  user: {
    id: string;
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
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', 'ml_default'); // Replaced with Cloudinary preset
    formData.append('cloud_name', 'dr07atq6z');     // Added Cloudinary cloud name

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dr07atq6z/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const imageUrl = data.secure_url;

      // Update the user's avatar URL in the database
      const { error } = await supabase
        .from('media')
        .update({ url: imageUrl })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating avatar:', error);
      } else {
        console.log('Avatar updated successfully');
        window.location.reload(); // Reload the page
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <Button fullWidth variant="contained" onClick={handleButtonClick}>
          Choose File
        </Button>
        {previewUrl && (
          <img src={previewUrl} alt="Preview" style={{ width: '20x%', marginTop: '10px' }} />
        )}
        <Button fullWidth variant="text" onClick={handleUpload}>
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};