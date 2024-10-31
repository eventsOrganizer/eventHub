import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BlurView } from 'expo-blur';
import { supabase } from '../../../../services/supabaseClient';
import tw from 'twrnc';

interface Availability {
  id?: number;
  date: Date;
  start: string;
  end: string;
  isNew?: boolean;
  isSelected?: boolean;
}

interface EventAvailabilityManagerProps {
  eventId: number;
  onTimeUpdate: (availabilities: Availability[]) => void;
}

export const EventAvailabilityManager: React.FC<EventAvailabilityManagerProps> = ({
  eventId,
  onTimeUpdate
}) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);

  useEffect(() => {
    fetchAvailabilities();
  }, [eventId]);

  const fetchAvailabilities = async () => {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('event_id', eventId);

    if (!error && data) {
      setAvailabilities(data.map(item => ({
        id: item.id,
        date: new Date(item.date),
        start: item.start,
        end: item.end,
        isNew: false,
        isSelected: false
      })));
    }
  };

  const handleAddAvailability = () => {
    const newAvailability = {
      date: new Date(),
      start: '00:00',
      end: '00:00',
      isNew: true,
      isSelected: true
    };
    setAvailabilities(prev => [...prev, newAvailability]);
    setSelectedAvailability(newAvailability);
  };

  const handleTimeUpdate = async () => {
    try {
      // Handle existing availabilities (PUT requests)
      const existingAvailabilities = availabilities.filter(a => !a.isNew);
      for (const avail of existingAvailabilities) {
        if (avail.id) {
          await supabase
            .from('availability')
            .update({
              date: avail.date.toISOString().split('T')[0],
              start: avail.start,
              end: avail.end
            })
            .eq('id', avail.id);
        }
      }

      // Handle new availabilities (POST requests)
      const newAvailabilities = availabilities.filter(a => a.isNew);
      if (newAvailabilities.length > 0) {
        await supabase
          .from('availability')
          .insert(newAvailabilities.map(avail => ({
            event_id: eventId,
            date: avail.date.toISOString().split('T')[0],
            start: avail.start,
            end: avail.end
          })));
      }

      onTimeUpdate(availabilities);
    } catch (error) {
      console.error('Error updating availabilities:', error);
    }
  };

  return (
    <BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4 mb-4`}>
      <Text style={tw`text-white text-lg mb-2`}>Event Times</Text>
      
      <ScrollView style={tw`max-h-40 mb-4`}>
        {availabilities.map((avail, index) => (
          <TouchableOpacity
            key={avail.id || `new-${index}`}
            style={tw`bg-white/20 p-3 rounded-lg mb-2 ${avail.isSelected ? 'border-2 border-blue-500' : ''}`}
            onPress={() => {
              setAvailabilities(prev => prev.map((a, i) => ({
                ...a,
                isSelected: i === index
              })));
              setSelectedAvailability(avail);
            }}
          >
            <Text style={tw`text-white`}>
              {avail.date.toDateString()} ({avail.start} - {avail.end})
              {avail.isNew ? ' (New)' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={tw`bg-blue-500 p-3 rounded-lg mb-2`}
        onPress={handleAddAvailability}
      >
        <Text style={tw`text-white text-center font-bold`}>Add New Time Slot</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-green-500 p-3 rounded-lg`}
        onPress={handleTimeUpdate}
      >
        <Text style={tw`text-white text-center font-bold`}>Update Times</Text>
      </TouchableOpacity>

      {/* Time Picker Modals */}
      {/* ... (Similar to the original EditEventScreen time picker modals) */}
    </BlurView>
  );
};