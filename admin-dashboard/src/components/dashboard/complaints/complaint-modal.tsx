import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { supabase } from '@/lib/supabase-client';

interface ComplaintDetailsModalProps {
  open: boolean;
  onClose: () => void;
  complaint: {
    title: string;
    details: string;
    user_id: string;
    event_id?: number;
    personal_id?: number;
    local_id?: number;
    material_id?: number;
  };
}

const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({ open, onClose, complaint }) => {
  const [additionalDetails, setAdditionalDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      let detailsData = null;
      let imageData = null;

      if (complaint.event_id) {
        const { data } = await supabase.from('event').select('name, details').eq('id', complaint.event_id).single();
        detailsData = data;
        const { data: mediaData } = await supabase.from('media').select('url').eq('event_id', complaint.event_id).single();
        imageData = mediaData?.url;
      } else if (complaint.personal_id) {
        const { data } = await supabase.from('personal').select('name, details').eq('id', complaint.personal_id).single();
        detailsData = data;
        const { data: mediaData } = await supabase.from('media').select('url').eq('personal_id', complaint.personal_id).single();
        imageData = mediaData?.url;
      } else if (complaint.local_id) {
        const { data } = await supabase.from('local').select('name, details').eq('id', complaint.local_id).single();
        detailsData = data;
        const { data: mediaData } = await supabase.from('media').select('url').eq('local_id', complaint.local_id).single();
        imageData = mediaData?.url;
      } else if (complaint.material_id) {
        const { data } = await supabase.from('material').select('name, details').eq('id', complaint.material_id).single();
        detailsData = data;
        const { data: mediaData } = await supabase.from('media').select('url').eq('material_id', complaint.material_id).single();
        imageData = mediaData?.url;
      }

      if (!imageData) {
        const { data: albumData } = await supabase.from('album').select('id').eq('user_id', complaint.user_id).single();
        if (albumData) {
          const { data: albumMediaData } = await supabase.from('media').select('url').eq('album_id', albumData.id).order('id', { ascending: true }).limit(1).single();
          imageData = albumMediaData?.url;
        }
      }

      setAdditionalDetails(detailsData);
      setImageUrl(imageData);

      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('firstname, lastname, username, media:media(url)')
        .eq('id', complaint.user_id)
        .single();

      if (userError) {
        console.error('Error fetching user details:', userError);
      } else {
        setUserDetails({
          ...userData,
          profile_image: userData.media?.[0]?.url ?? '',
        });
      }
    };

    if (open) {
      fetchDetails();
    }
  }, [open, complaint]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, backgroundColor: 'white', maxWidth: 600, margin: 'auto', mt: '10%', borderRadius: 2, boxShadow: 24 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {complaint.title}
        </Typography>
        
        {userDetails && (
          <Box display="flex" alignItems="center" mt={1} mb={2}>
            <Avatar src={userDetails.profile_image} alt="User Profile" sx={{ width: 50, height: 50, mr: 2 }} />
            <Box>
              <Typography variant="subtitle1">
                {userDetails.firstname} {userDetails.lastname}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                @{userDetails.username}
              </Typography>
            </Box>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Complaint Details
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {complaint.details}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" gutterBottom>
          Related Item
        </Typography>
        <Card
          sx={{
            mb: 3,
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle1">
                  {additionalDetails?.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {additionalDetails?.details}
                </Typography>
              </Box>
              {imageUrl && (
                <Box sx={{ ml: 2 }}>
                  <img src={imageUrl} alt="Related" style={{ width: 140, height: 140, borderRadius: 4, objectFit: 'cover', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)' }} />
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        <Button onClick={onClose} variant="contained" color="primary" fullWidth>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ComplaintDetailsModal;
