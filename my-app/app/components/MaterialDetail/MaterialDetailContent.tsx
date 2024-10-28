import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import MaterialOverview from './MaterialOverview';
import AvailabilityCalendar from './AvailabilityCalendar';
import ActionButtons from './ActionButtons';
import ReviewAndCommentButtons from './ReviewAndCommentButtons';
import { Material } from '../../navigation/types';

interface MaterialDetailContentProps {
  material: Material;
  theme: any;
  onReviewPress: () => void;
  onCommentPress: () => void;
}

const MaterialDetailContent: React.FC<MaterialDetailContentProps> = ({
  material,
  theme,
  onReviewPress,
  onCommentPress,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.light }]}>
      <MaterialOverview material={material} theme={theme} />
      
      {material.sell_or_rent === 'rent' && (
        <Card style={[styles.calendarCard, { backgroundColor: theme.light }]}>
          <Card.Content>
            <AvailabilityCalendar materialId={material.id} theme={theme} />
          </Card.Content>
        </Card>
      )}

      <ReviewAndCommentButtons
        material={material}
        theme={theme}
        onReviewPress={onReviewPress}
        onCommentPress={onCommentPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  calendarCard: {
    marginVertical: 16,
    borderRadius: 15,
    elevation: 4,
  },
});

export default MaterialDetailContent;