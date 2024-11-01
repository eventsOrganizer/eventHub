import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import tw from 'twrnc';
import { theme } from '../../lib/theme';

const categories = [
  { name: 'Music', icon: 'musical-notes', color: '#FF2D55', route: 'MusicCategory' },
  { name: 'Food', icon: 'restaurant', color: '#FF9500', route: 'FoodCategory' },
  { name: 'Photo', icon: 'camera', color: '#5856D6', route: 'PhotoCategory' },
  { name: 'Sports', icon: 'basketball', color: '#FF3B30', route: 'SportsCategory' },
  { name: 'Politics', icon: 'megaphone', color: '#5AC8FA', route: 'PoliticsCategory' },
  { name: 'Art', icon: 'color-palette', color: '#4CD964', route: 'ArtCategory' },
  { name: 'Home', icon: 'home', color: '#007AFF', route: 'HomeCategory' },
  { name: 'Business', icon: 'briefcase', color: '#FF2D55', route: 'BusinessCategory' },
  { name: 'Education', icon: 'school', color: '#FFCC00', route: 'EducationCategory' },
  { name: 'Tech', icon: 'hardware-chip', color: '#5856D6', route: 'TechCategory' },
];

const ServiceIcons: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  return (
    <BlurView 
      intensity={80} 
      tint="light" 
      style={tw`py-2`}
    >
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4`}
      >
        {categories.map((category, index) => (
          <MotiView
            key={index}
            animate={{ 
              translateY: [0, -2, 0],
              scale: activeIcon === category.name ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              type: 'timing',
              duration: 2000,
              loop: true
            }}
          >
            <TouchableOpacity
              onPressIn={() => setActiveIcon(category.name)}
              onPressOut={() => setActiveIcon(null)}
              onPress={() => navigation.navigate(category.route)}
              style={tw`
                items-center justify-center
                w-20 h-20 mx-2
                ${activeIcon === category.name ? `bg-[${theme.colors.accent}]/5` : 'bg-transparent'}
              `}
            >
              <View style={tw`
                w-12 h-12
                rounded-full
                items-center justify-center
                bg-[${theme.colors.overlay}]
              `}>
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={category.color}
                />
              </View>
              <Text style={tw`
                mt-1 text-xs font-semibold
                text-[${theme.colors.secondary}]
              `}>
                {category.name}
              </Text>
            </TouchableOpacity>
          </MotiView>
        ))}
      </ScrollView>
    </BlurView>
  );
};

export default ServiceIcons;