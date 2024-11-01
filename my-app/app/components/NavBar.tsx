import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import { NotificationIcon } from './Notifications/NotificationIcon';
import { NotificationsModal } from './Notifications/NotificationsModal';
import { theme } from '../../lib/theme';

interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
  onSearch: (searchTerm: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigation = useNavigation();

  const handleSearch = () => {
    onSearch(searchTerm);
    navigation.navigate('SearchResultsScreen', { initialSearchTerm: searchTerm });
  };

  return (
    <>
      <BlurView intensity={90} tint="light" style={styles.container}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientMiddle, theme.colors.gradientEnd]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={24} color={theme.colors.secondary} style={styles.searchIcon} />
              <TextInput
                style={styles.input}
                placeholder="Search events and services..."
                placeholderTextColor={theme.colors.cardDescription}
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
              <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                <Ionicons name="arrow-forward" size={24} color={theme.colors.accent} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionsContainer}>
              <View style={styles.leftActions}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('UserProfile' as never)} 
                  style={styles.iconButton}
                >
                  <Ionicons name="person-outline" size={28} color={theme.colors.secondary} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => setShowNotifications(true)}
                >
                  <NotificationIcon size={28} onPress={() => setShowNotifications(true)} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('ChatList' as never)}
                >
                  <Ionicons name="chatbubbles-outline" size={28} color={theme.colors.secondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={setSelectedFilter}
                  items={[
                    { label: 'All Events', value: 'all' },
                    { label: 'This Week', value: 'this_week' },
                    { label: 'This Month', value: 'this_month' },
                  ]}
                  style={pickerSelectStyles}
                  value={selectedFilter}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{ label: 'Filter Events', value: null }}
                  Icon={() => (
                    <Ionicons 
                      name="chevron-down" 
                      size={24} 
                      color={theme.colors.secondary} 
                      style={styles.pickerIcon} 
                    />
                  )}
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </BlurView>

      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  gradient: {
    padding: theme.spacing.md,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    gap: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginHorizontal: theme.spacing.sm,
  },
  input: {
    flex: 1,
    color: theme.colors.secondary,
    fontSize: theme.typography.body.fontSize,
    paddingVertical: theme.spacing.sm,
  },
  searchButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.borderRadius.full,
    marginLeft: theme.spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  iconButton: {
    padding: theme.spacing.sm,
    backgroundColor: 'transparent',
  },
  pickerContainer: {
    width: 150,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pickerIcon: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: theme.typography.body.fontSize,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    color: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
  },
  inputAndroid: {
    fontSize: theme.typography.body.fontSize,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    color: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
  },
  iconContainer: {
    top: '50%',
    right: theme.spacing.sm,
  },
});

export default NavBar;