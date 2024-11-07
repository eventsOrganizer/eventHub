import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBackButton = true,
  rightComponent
}) => {
  const navigation = useNavigation();
  
  return (
    <LinearGradient
  colors={['#E8EAF6', 'white', '#9FA8DA','white','white']}
  style={tw`shadow-lg`}
>
      <BlurView intensity={80} tint="light" style={styles.headerContainer}>
        <StatusBar barStyle="light-content" />
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            {showBackButton && (
              <TouchableOpacity 
                style={tw`mr-4 p-2 bg-black/10 rounded-full`}
                onPress={onBack || (() => navigation.goBack())}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            )}
            <View>
              <Text style={tw`text-2xl font-bold text-black`}>{title}</Text>
              {subtitle && (
                <Text style={tw`text-base text-blue mt-1`}>{subtitle}</Text>
              )}
            </View>
          </View>
          
          <View style={tw`flex-row items-center`}>
            {rightComponent}
            <TouchableOpacity 
              style={tw`ml-4 p-2 bg-black/10 rounded-full`}
              onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="home-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  }
});

export default Header;
