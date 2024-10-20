import React, { forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

interface ShareButtonProps {
  itemType: 'event' | 'service';
  itemId: number;
}

export interface ShareButtonRef {
  generateShareUrl: () => string;
}

const ShareButton = forwardRef<ShareButtonRef, ShareButtonProps>(({ itemType, itemId }, ref) => {
  const generateShareUrl = () => {
    const projectName = Constants.expoConfig?.name || 'my-app';
    const projectSlug = Constants.expoConfig?.slug || 'my-app';
    return `exp://exp.host/@${projectName}/${projectSlug}?screen=${itemType}&id=${itemId}`;
  };

  useImperativeHandle(ref, () => ({
    generateShareUrl,
  }));

  const handleShare = async () => {
    const url = generateShareUrl();
    try {
      const result = await Share.share({
        message: `Check out this ${itemType}: ${url}`,
        url: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleShare}>
      <Ionicons name="share-outline" size={16} color="#fff" />
    </TouchableOpacity>
  );
});

export default ShareButton;