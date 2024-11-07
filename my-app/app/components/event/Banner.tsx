import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface BannerProps {
  title: string;
}

const Banner: React.FC<BannerProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'transparent']}
        style={styles.banner}
      >
        <Text style={styles.text}>{title}</Text>
        <TouchableOpacity style={styles.addButton}>
          <BlurView intensity={80} tint="dark" style={styles.blurView}>
            <Ionicons name="add" size={24} color="#fff" />
          </BlurView>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 0, // Remove border radius
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1a2a4a', // Darker shade of blue
  },
  addButton: {
    overflow: 'hidden',
    borderRadius: 20,
  },
  blurView: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default Banner;