import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { Service } from '../../../services/serviceTypes';
import { theme } from '../../../../lib/theme';
import moment from 'moment';

interface ServiceDetailsProps {
  personalData: Service;
  onReviewPress: () => void;
  onCommentPress: () => void;
  onBookPress: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  personalData,
  onReviewPress,
  onCommentPress,
  onBookPress,
}) => {
  if (!personalData) return null;

  const renderDetailItem = (icon: keyof typeof Ionicons.glyphMap, content: string) => (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', damping: 18 }}
      style={styles.iconContainer}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={24} color={theme.colors.accent} />
      </View>
      <Text style={styles.detailText}>{content}</Text>
    </MotiView>
  );

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      <BlurView intensity={80} tint="light" style={styles.container}>
        <Text style={styles.title}>Service Details</Text>
        <View style={styles.detailsContainer}>
          {renderDetailItem('person-outline', personalData.name || 'N/A')}
          {renderDetailItem('pricetag-outline', `${personalData.priceperhour || 0} per hour`)}
          {renderDetailItem('calendar-outline', 
            `${personalData.startdate ? moment(personalData.startdate).format('MMMM Do') : 'N/A'} to ${personalData.enddate ? moment(personalData.enddate).format('MMMM Do YYYY') : 'N/A'}`
          )}
          {renderDetailItem('information-circle-outline', personalData.details || 'No details available')}
          {personalData.subcategory && renderDetailItem('list-outline',
            `${personalData.subcategory.name || 'N/A'} ${personalData.subcategory.category?.name ? ` - ${personalData.subcategory.category.name}` : ''}`
          )}
        </View>

        <View style={styles.actionContainer}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}
          >
            <TouchableOpacity style={styles.actionButton} onPress={onReviewPress}>
              <BlurView intensity={60} tint="light" style={styles.iconBackground}>
                <Ionicons name="star-outline" size={32} color={theme.colors.accent} />
              </BlurView>
              <Text style={styles.actionText}>Reviews</Text>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300 }}
          >
            <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
              <BlurView intensity={60} tint="light" style={styles.iconBackground}>
                <Ionicons name="chatbubble-outline" size={32} color={theme.colors.accent} />
              </BlurView>
              <Text style={styles.actionText}>Comments</Text>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 400 }}
          >
            <TouchableOpacity style={styles.actionButton} onPress={onBookPress}>
              <BlurView intensity={60} tint="light" style={styles.iconBackground}>
                <Ionicons name="calendar-outline" size={32} color={theme.colors.accent} />
              </BlurView>
              <Text style={styles.actionText}>Book</Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </BlurView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.personalDetailBg,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.personalDetailTitle,
    marginBottom: theme.spacing.md,
  },
  detailsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconWrapper: {
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.sm,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    ...theme.typography.body,
    color: theme.colors.personalDetailText,
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconBackground: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
  },
  actionText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.accent,
    ...theme.typography.subtitle,
  },
});

export default ServiceDetails;