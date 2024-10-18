import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, {userId, type , localId, eventId, personalId, materialId, albumId}: {userId: string, type: string, localId?: number, eventId?: number, personalId?: number, materialId?: number, albumId?: number}) => {
    setUploading(true);
    setError(null);

    try {
      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files') // Replace with your actual bucket name
        .upload(`upload/${file.name}`, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded file
      const { data: publicURL, error: urlError } = supabase.storage
        .from('files')
        .getPublicUrl(`public/${file.name}`);

      if (urlError) {
        throw urlError;
      }

      // Insert file metadata into the media table
      const { error: insertError } = await supabase
        .from('media')
        .insert([
          {
            user_id: userId,
            url: publicURL.publicUrl,
            type,
            local_id: localId,
            event_id: eventId,
            personal_id: personalId,
            material_id: materialId,
            album_id: albumId,
          },
        ]);

      if (insertError) {
        throw insertError;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};

export default useFileUpload;