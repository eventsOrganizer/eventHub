import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const useFileUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [publicUrl, setPublicUrl] = useState<string | null>(null);

    const uploadFile = async (
        file: File, // Using the native File type
        { userId, type, localId, eventId, personalId, materialId, albumId }:
        { userId: string, type: string, localId?: number, eventId?: number, personalId?: number, materialId?: number, albumId?: number }
    ) => {
        setUploading(true);
        setError(null);
        setUploadSuccess(false);

        try {
            console.log(`Uploading file: ${file.name}`); // Use file.name for the filename
            const { data: uploadData, error: uploadError } = await supabase.storage
            .deleteBucket('uploads')

            if (uploadError) {
                throw uploadError;
            }
            console.log("upload success", uploadData);
            // const { data: publicURL } = supabase.storage
            //     .from('files')
            //     .getPublicUrl(`upload/${file.name}`); // Use file.name

            // setPublicUrl(publicURL.publicUrl);

            // const { error: insertError } = await supabase
            //     .from('media')
            //     .insert([{
            //         user_id: userId,
            //         url: publicURL.publicUrl,
            //         type,
            //         local_id: localId,
            //         event_id: eventId,
            //         personal_id: personalId,
            //         material_id: materialId,
            //         album_id: albumId,
            //     }]);

            // if (insertError) {
            //     console.error('Insert Error:', insertError);
            //     throw insertError;
            // }

            // setUploadSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return { uploadFile, uploading, uploadSuccess, error, publicUrl };
};

export default useFileUpload;
