import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { 
  Headphones, 
  BedDouble, 
  UtensilsCrossed, 
  Wine, 
  Beer, 
  Sparkles, 
  Calendar, 
  ShoppingCart,
  Grid,
  Soup,
  Brush,
  Table
} from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';

const subcategories = [
  { id: null, name: 'All', Icon: Grid },
  { id: 159, name: 'Audio', Icon: Headphones },
  { id: 160, name: 'Furniture', Icon: BedDouble },
  { id: 161, name: 'Plates', Icon: Soup },
  { id: 162, name: 'Cutlery', Icon: UtensilsCrossed },
  { id: 163, name: 'Glassware', Icon: Wine },
  { id: 164, name: 'Bar', Icon: Beer },
  { id: 165, name: 'Cleaning', Icon: Brush },
  { id: 166, name: 'Decor', Icon: Sparkles },
  { id: 167, name: 'Tableware', Icon: Table },
  { id: 'rent', name: 'Rent', Icon: Calendar },
  { id: 'sell', name: 'Sell', Icon: ShoppingCart },
];

type SubcategoryListProps = {
  selectedSubcategory: number | string | null;
  onSelectSubcategory: (subcategoryId: number | string | null) => void;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SubcategoryItem = ({ 
  subcategory, 
  isSelected, 
  onPress 
}: { 
  subcategory: typeof subcategories[0];
  isSelected: boolean;
  onPress: () => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isSelected ? 1.05 : 1) },
      ],
      backgroundColor: withTiming(
        isSelected ? '#4A90E2' : 'rgba(255, 255, 255, 0.15)',
        { duration: 200 }
      ),
    };
  });

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      style={[styles.subcategoryItem, animatedStyle]}
    >
      <BlurView intensity={20} tint="light" style={styles.blurContainer}>
        <subcategory.Icon 
          size={28} 
          color={isSelected ? "white" : "#4A90E2"} 
          strokeWidth={2}
        />
        <Text style={[
          styles.subcategoryName,
          isSelected && styles.selectedSubcategoryText
        ]}>
          {subcategory.name}
        </Text>
      </BlurView>
    </AnimatedTouchableOpacity>
  );
};

const SubcategoryList: React.FC<SubcategoryListProps> = ({ 
  selectedSubcategory, 
  onSelectSubcategory 
}) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.subcategoriesScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {subcategories.map((subcategory) => (
          <SubcategoryItem
            key={subcategory.id?.toString() || 'all'}
            subcategory={subcategory}
            isSelected={selectedSubcategory === subcategory.id}
            onPress={() => onSelectSubcategory(subcategory.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginTop: 5,
  },
  subcategoriesScroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  subcategoryItem: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blurContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    width: 85,
    height: 85,
  },
  subcategoryName: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    color: '#4A90E2',
    fontWeight: '600',
  },
  selectedSubcategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SubcategoryList;
