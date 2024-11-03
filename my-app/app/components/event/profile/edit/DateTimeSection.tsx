import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import { supabase } from '../../../../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

interface DateTimeSectionProps {
  eventId: number;
  onAvailabilityChange: (availabilities: {
    added: Availability[],
    updated: Availability[],
    deleted: number[]
  }) => void;
}

interface Availability {
  id: number;
  date: string;
  start: string;
  end: string;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({ eventId, onAvailabilityChange }) => {
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAvailability, setNewAvailability] = useState({
    date: new Date(),
    startTime: new Date(),
    endTime: new Date()
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // Staging states
  const [stagedAdditions, setStagedAdditions] = useState<Availability[]>([]);
  const [stagedUpdates, setStagedUpdates] = useState<Availability[]>([]);
  const [stagedDeletions, setStagedDeletions] = useState<number[]>([]);

  useEffect(() => {
    fetchAvailabilities();
  }, [eventId]);

  useEffect(() => {
    // Notify parent component of all staged changes
    onAvailabilityChange({
      added: stagedAdditions,
      updated: stagedUpdates,
      deleted: stagedDeletions
    });
  }, [stagedAdditions, stagedUpdates, stagedDeletions]);

  const fetchAvailabilities = async () => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('id, date, start, end')
        .eq('event_id', eventId)
        .order('date', { ascending: true });

      if (error) throw error;

      if (data) {
        setAvailabilities(data);
        if (data.length > 0) {
          setSelectedAvailability(data[0]);
          setSelectedDate(data[0].date);
        }
      }
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      Alert.alert('Error', 'Failed to load date and time information');
    }
  };

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    setShowStartDateCalendar(false);
    setShowStartTimePicker(true);
    if (isEditing) {
      setSelectedAvailability(prev => prev ? { ...prev, date: day.dateString } : null);
    } else {
      setNewAvailability(prev => ({
        ...prev,
        date: new Date(day.dateString)
      }));
    }
  };

  const handleStartTimeSelect = (hours: number, minutes: number) => {
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    if (isEditing && selectedAvailability) {
      setSelectedAvailability({ ...selectedAvailability, start: timeString });
    } else {
      const newTime = new Date(newAvailability.startTime);
      newTime.setHours(hours);
      newTime.setMinutes(minutes);
      setNewAvailability(prev => ({ ...prev, startTime: newTime }));
    }
  };

  const handleEndTimeSelect = (hours: number, minutes: number) => {
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    if (isEditing && selectedAvailability) {
      setSelectedAvailability({ ...selectedAvailability, end: timeString });
    } else {
      const newTime = new Date(newAvailability.endTime);
      newTime.setHours(hours);
      newTime.setMinutes(minutes);
      setNewAvailability(prev => ({ ...prev, endTime: newTime }));
    }
  };

  const handleAddAvailability = () => {
    const newAvailabilityData = {
      id: -Date.now(), // Temporary negative ID for new items
      event_id: eventId,
      date: newAvailability.date.toISOString().split('T')[0],
      start: newAvailability.startTime.toTimeString().split(' ')[0],
      end: newAvailability.endTime.toTimeString().split(' ')[0]
    };

    setStagedAdditions(prev => [...prev, newAvailabilityData]);
    setAvailabilities(prev => [...prev, newAvailabilityData]);
    setShowEndTimePicker(false);
  };

  const handleUpdateAvailability = () => {
    if (!selectedAvailability) return;

    setStagedUpdates(prev => {
      const exists = prev.find(a => a.id === selectedAvailability.id);
      if (exists) {
        return prev.map(a => a.id === selectedAvailability.id ? selectedAvailability : a);
      }
      return [...prev, selectedAvailability];
    });

    setAvailabilities(prev =>
      prev.map(a => a.id === selectedAvailability.id ? selectedAvailability : a)
    );
    
    setShowEndTimePicker(false);
    setIsEditing(false);
  };

  const handleDeleteAvailability = (id: number) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this date and time?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setStagedDeletions(prev => [...prev, id]);
            setAvailabilities(prev => prev.filter(a => a.id !== id));
            if (selectedAvailability?.id === id) {
              setSelectedAvailability(null);
            }
          }
        }
      ]
    );
  };

  const startEditAvailability = (availability: Availability) => {
    setSelectedAvailability(availability);
    setIsEditing(true);
    setShowStartDateCalendar(true);
  };

  return (
    <BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4 mb-4`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-white text-lg`}>Dates & Times</Text>
        <TouchableOpacity
          style={tw`bg-green-500 p-2 rounded-lg`}
          onPress={() => {
            setIsEditing(false);
            setSelectedAvailability(null);
            setShowStartDateCalendar(true);
          }}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {availabilities.length === 0 ? (
        <Text style={tw`text-white/70 text-center py-4`}>
          No dates and times added yet
        </Text>
      ) : (
        <FlatList
          data={availabilities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={tw`bg-white/20 p-3 rounded-lg mb-2 flex-row justify-between items-center`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white font-semibold`}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={tw`text-white/80`}>
                  {item.start.slice(0, 5)} - {item.end.slice(0, 5)}
                </Text>
              </View>
              <View style={tw`flex-row`}>
                <TouchableOpacity
                  style={tw`bg-blue-500 p-2 rounded-lg mr-2`}
                  onPress={() => startEditAvailability(item)}
                >
                  <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`bg-red-500 p-2 rounded-lg`}
                  onPress={() => handleDeleteAvailability(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal
        visible={showStartDateCalendar}
        transparent
        animationType="slide"
      >
        <View style={tw`flex-1 justify-center bg-black/50`}>
          <View style={tw`bg-white mx-4 rounded-xl overflow-hidden`}>
            <View style={tw`bg-blue-500 p-4`}>
              <Text style={tw`text-white text-lg font-bold text-center`}>
                {isEditing ? 'Edit Date' : 'Select Date'}
              </Text>
            </View>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#4A90E2' }
              }}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                selectedDayBackgroundColor: '#4A90E2',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#4A90E2',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
              }}
            />
            <TouchableOpacity
              style={tw`bg-gray-200 p-4`}
              onPress={() => {
                setShowStartDateCalendar(false);
                setIsEditing(false);
              }}
            >
              <Text style={tw`text-center font-semibold`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showStartTimePicker} transparent animationType="slide">
        <View style={tw`flex-1 justify-end bg-black/50`}>
          <View style={tw`bg-white rounded-t-3xl p-4`}>
            <Text style={tw`text-xl font-bold text-center mb-4`}>
              {isEditing ? 'Edit Start Time' : 'Select Start Time'}
            </Text>
            <View style={tw`flex-row justify-center items-center mb-4`}>
              <View style={tw`h-40 w-20 border-r border-gray-200`}>
                <ScrollView>
                  {Array.from({ length: 24 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={tw`p-3 ${
                        isEditing
                          ? i === parseInt(selectedAvailability?.start.split(':')[0] || '0') ? 'bg-blue-500' : ''
                          : i === newAvailability.startTime.getHours() ? 'bg-blue-500' : ''
                      }`}
                      onPress={() => handleStartTimeSelect(i, isEditing ? parseInt(selectedAvailability?.start.split(':')[1] || '0') : newAvailability.startTime.getMinutes())}
                    >
                      <Text style={tw`text-center ${
                        isEditing
                          ? i === parseInt(selectedAvailability?.start.split(':')[0] || '0') ? 'text-white' : 'text-black'
                          : i === newAvailability.startTime.getHours() ? 'text-white' : 'text-black'
                      }`}>
                        {i.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <Text style={tw`mx-2 text-xl`}>:</Text>
              <View style={tw`h-40 w-20 border-l border-gray-200`}>
                <ScrollView>
                  {[0, 15, 30, 45].map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={tw`p-3 ${
                        isEditing
                          ? minute === parseInt(selectedAvailability?.start.split(':')[1] || '0') ? 'bg-blue-500' : ''
                          : minute === newAvailability.startTime.getMinutes() ? 'bg-blue-500' : ''
                      }`}
                      onPress={() => handleStartTimeSelect(
                        isEditing ? parseInt(selectedAvailability?.start.split(':')[0] || '0') : newAvailability.startTime.getHours(),
                        minute
                      )}
                    >
                      <Text style={tw`text-center ${
                        isEditing
                          ? minute === parseInt(selectedAvailability?.start.split(':')[1] || '0') ? 'text-white' : 'text-black'
                          : minute === newAvailability.startTime.getMinutes() ? 'text-white' : 'text-black'
                      }`}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View style={tw`flex-row justify-end mt-4`}>
              <TouchableOpacity
                style={tw`bg-gray-200 p-3 rounded-xl mr-2 flex-1`}
                onPress={() => {
                  setShowStartTimePicker(false);
                  setIsEditing(false);
                }}
              >
                <Text style={tw`text-center font-semibold`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-blue-500 p-3 rounded-xl flex-1`}
                onPress={() => {
                  setShowStartTimePicker(false);
                  setShowEndTimePicker(true);
                }}
              >
                <Text style={tw`text-white text-center font-semibold`}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showEndTimePicker} transparent animationType="slide">
        <View style={tw`flex-1 justify-end bg-black/50`}>
          <View style={tw`bg-white rounded-t-3xl p-4`}>
            <Text style={tw`text-xl font-bold text-center mb-4`}>
              {isEditing ? 'Edit End Time' : 'Select End Time'}
            </Text>
            <View style={tw`flex-row justify-center items-center mb-4`}>
              <View style={tw`h-40 w-20 border-r border-gray-200`}>
                <ScrollView>
                  {Array.from({ length: 24 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={tw`p-3 ${
                        isEditing
                          ? i === parseInt(selectedAvailability?.end.split(':')[0] || '0') ? 'bg-blue-500' : ''
                          : i === newAvailability.endTime.getHours() ? 'bg-blue-500' : ''
                      }`}
                      onPress={() => handleEndTimeSelect(i, isEditing ? parseInt(selectedAvailability?.end.split(':')[1] || '0') : newAvailability.endTime.getMinutes())}
                    >
                      <Text style={tw`text-center ${
                        isEditing
                          ? i === parseInt(selectedAvailability?.end.split(':')[0] || '0') ? 'text-white' : 'text-black'
                          : i === newAvailability.endTime.getHours() ? 'text-white' : 'text-black'
                      }`}>
                        {i.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <Text style={tw`mx-2 text-xl`}>:</Text>
              <View style={tw`h-40 w-20 border-l border-gray-200`}>
                <ScrollView>
                  {[0, 15, 30, 45].map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={tw`p-3 ${
                        isEditing
                          ? minute === parseInt(selectedAvailability?.end.split(':')[1] || '0') ? 'bg-blue-500' : ''
                          : minute === newAvailability.endTime.getMinutes() ? 'bg-blue-500' : ''
                      }`}
                      onPress={() => handleEndTimeSelect(
                        isEditing ? parseInt(selectedAvailability?.end.split(':')[0] || '0') : newAvailability.endTime.getHours(),
                        minute
                      )}
                    >
                      <Text style={tw`text-center ${
                        isEditing
                          ? minute === parseInt(selectedAvailability?.end.split(':')[1] || '0') ? 'text-white' : 'text-black'
                          : minute === newAvailability.endTime.getMinutes() ? 'text-white' : 'text-black'
                      }`}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View style={tw`flex-row justify-end mt-4`}>
              <TouchableOpacity
                style={tw`bg-gray-200 p-3 rounded-xl mr-2 flex-1`}
                onPress={() => {
                  setShowEndTimePicker(false);
                  setIsEditing(false);
                }}
              >
                <Text style={tw`text-center font-semibold`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-blue-500 p-3 rounded-xl flex-1`}
                onPress={isEditing ? handleUpdateAvailability : handleAddAvailability}
              >
                <Text style={tw`text-white text-center font-semibold`}>
                  {isEditing ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </BlurView>
  );
};

export default DateTimeSection;