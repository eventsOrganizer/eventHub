import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { HomeScreenSection } from '../../navigation/types';
import { theme } from '../../../lib/theme';

interface ServicesSectionProps {
  sections: HomeScreenSection[];
}

const { width } = Dimensions.get('window');

const ServicesSection: React.FC<ServicesSectionProps> = ({ sections = [] }) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 800 }}
      style={tw`mt-2 mx-2`} // Reduced top margin to bring content closer
    >
      <BlurView
        intensity={80}
        tint="light"
        style={[
          tw`rounded-2xl overflow-hidden`,
          {
            backgroundColor: `${theme.colors.cardBg}95`,
            borderWidth: 1,
            borderColor: theme.colors.accent,
          }
        ]}
      >
        <MotiView
          from={{ translateY: 20 }}
          animate={{ translateY: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          style={tw`p-4`}
        >
          <Text style={[
            tw`text-xl font-bold mb-4`,
            { color: theme.colors.cardTitle }
          ]}>
            Services
          </Text>
          
          <View style={tw`space-y-4`}>
            {sections.map((section, index) => (
              <MotiView
                key={index}
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  delay: index * 150,
                  damping: 15,
                  stiffness: 200,
                }}
                style={[
                  tw`bg-white rounded-xl overflow-hidden`,
                  {
                    shadowColor: theme.colors.shadow,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }
                ]}
              >
                <View style={[
                  tw`border-l-4`,
                  { borderLeftColor: theme.colors.accent }
                ]}>
                  <View style={[
                    tw`p-4`,
                    { backgroundColor: `${theme.colors.overlay}` }
                  ]}>
                    <View style={tw`flex-row justify-between items-center mb-3`}>
                      <Text style={[
                        tw`text-lg font-semibold`,
                        { color: theme.colors.cardTitle }
                      ]}>
                        {section.title}
                      </Text>
                      <TouchableOpacity
                        onPress={section.onSeeAll}
                        style={[
                          tw`flex-row items-center py-1 px-3 rounded-full`,
                          { backgroundColor: `${theme.colors.accent}15` }
                        ]}
                      >
                        <Text style={[
                          tw`mr-1 text-sm font-medium`,
                          { color: theme.colors.accent }
                        ]}>
                          See All
                        </Text>
                        <Ionicons 
                          name="arrow-forward" 
                          size={16} 
                          color={theme.colors.accent} 
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={tw`flex-row flex-wrap justify-between`}>
                      {section.data.map((item, itemIndex) => (
                        <TouchableOpacity
                          key={itemIndex}
                          onPress={() => section.onItemPress(item)}
                          style={[
                            tw`mb-3`,
                            {
                              width: (width - 80) / 2,
                              backgroundColor: theme.colors.eventBackground,
                              borderRadius: theme.borderRadius.md,
                              padding: theme.spacing.sm,
                              shadowColor: theme.colors.eventShadow,
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.1,
                              shadowRadius: 4,
                              elevation: 2,
                            }
                          ]}
                        >
                          <Text 
                            numberOfLines={1} 
                            style={[
                              tw`font-medium mb-1`,
                              { color: theme.colors.eventTitle }
                            ]}
                          >
                            {item.name || item.title}
                          </Text>
                          {item.description && (
                            <Text 
                              numberOfLines={2}
                              style={[
                                tw`text-xs`,
                                { color: theme.colors.eventText }
                              ]}
                            >
                              {item.description}
                            </Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </MotiView>
            ))}
          </View>
        </MotiView>
      </BlurView>
    </MotiView>
  );
};

export default ServicesSection;