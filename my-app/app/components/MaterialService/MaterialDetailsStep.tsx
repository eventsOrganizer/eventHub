import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as VideoPicker from 'expo-image-picker';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

interface MediaFile {
  uri: string;
  type: 'image' | 'video';
}

interface MaterialDetailsStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const MaterialDetailsStep: React.FC<MaterialDetailsStepProps> = ({ formData, setFormData }) => {
  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const newMediaFiles = result.assets.map(asset => ({
        uri: asset.uri,
        type: 'image' as const
      }));
      
      setFormData({
        ...formData,
        mediaFiles: [...(formData.mediaFiles || []), ...newMediaFiles]
      });
    }
  };

  const handleVideoUpload = async () => {
    let result = await VideoPicker.launchImageLibraryAsync({
      mediaTypes: VideoPicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const videoFile = {
        uri: result.assets[0].uri,
        type: 'video' as const
      };
      
      setFormData({
        ...formData,
        mediaFiles: [...(formData.mediaFiles || []), videoFile]
      });
    }
  };

  const removeMedia = (index: number) => {
    const updatedFiles = [...(formData.mediaFiles || [])];
    updatedFiles.splice(index, 1);
    setFormData({ ...formData, mediaFiles: updatedFiles });
  };

  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.container}>
      <Text style={styles.label}>Material Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        placeholderTextColor="#a0a0a0"
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
      />
      
      <Text style={styles.label}>Material Details</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter details"
        placeholderTextColor="#a0a0a0"
        value={formData.details}
        onChangeText={(text) => setFormData({ ...formData, details: text })}
        multiline
        numberOfLines={4}
      />
      
      <Text style={styles.label}>Upload Media</Text>
      <View style={styles.uploadButtonsContainer}>
        <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
          <MaterialIcons name="photo-library" size={24} color="#fff" />
          <Text style={styles.uploadText}>Add Photos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleVideoUpload} style={styles.uploadButton}>
          <MaterialIcons name="videocam" size={24} color="#fff" />
          <Text style={styles.uploadText}>Add Video</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={styles.mediaPreviewContainer}>
        {formData.mediaFiles?.map((file: MediaFile, index: number) => (
          <View key={index} style={styles.mediaPreview}>
            <Image source={{ uri: file.uri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeMedia(index)}
            >
              <MaterialIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
            {file.type === 'video' && (
              <View style={styles.videoIndicator}>
                <MaterialIcons name="videocam" size={20} color="#fff" />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

export default MaterialDetailsStep;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  mediaPreviewContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  videoIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
});
