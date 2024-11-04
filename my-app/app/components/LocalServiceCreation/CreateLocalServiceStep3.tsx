import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import  ServiceCalendar  from '../reuseableForCreationService/ServiceCalendar';
import ProgressBar from '../reuseableForCreationService/ProgressBar';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import Input from './input';
import { parse, isValid, addYears, addMonths, addWeeks, format } from 'date-fns';
import { Select } from './select';

type RootStackParamList = {
  CreateLocalServiceStep4: {
    serviceName: string;
    description: string;
    images: string[];
    price: number;
    subcategoryId: string;
    subcategoryName: string;
    startDate: string;
    endDate: string;
    interval: string;
    exceptionDates: string[];
  };
};

const CreateLocalServiceStep3 = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { serviceName, description, images, price, subcategoryId, subcategoryName } = route.params as { serviceName: string; description: string; images: string[]; price: number; subcategoryId: string; subcategoryName: string };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interval, setInterval] = useState('Daily');
  const [exceptionDates, setExceptionDates] = useState<Date[]>([]);
  const [showCalendar, setShowCalendar] = useState(true);

  useEffect(() => {
    if (startDate && startDate.length === 10 && interval) {
      const parsedDate = parse(startDate, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        let end;
        switch (interval) {
          case 'Yearly':
            end = addYears(parsedDate, 1);
            break;
          case 'Monthly':
            end = addMonths(parsedDate, 1);
            break;
          case 'Weekly':
            end = addWeeks(parsedDate, 1);
            break;
          default:
            return;
        }
        setEndDate(format(end, 'yyyy-MM-dd'));
        setShowCalendar(true);
      } else {
        setShowCalendar(false);
        Alert.alert('Error', 'Invalid start date. Please use the format YYYY-MM-DD.');
      }
    } else {
      setShowCalendar(false);
    }
  }, [startDate, interval]);

  const handleNext = () => {
    if (startDate && endDate && interval && exceptionDates.length > 0) {
      navigation.navigate('CreateLocalServiceStep4', {
        serviceName,
        description,
        images,
        price,
        subcategoryId,
        subcategoryName,
        startDate,
        endDate,
        interval,
        exceptionDates: exceptionDates.map(date => date.toISOString())
      });
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs et sélectionner au moins une date d\'exception.');
    }
  };

  const handleSelectDate = (date: Date) => {
    setExceptionDates(prev => 
      prev.some(d => d.getTime() === date.getTime())
        ? prev.filter(d => d.getTime() !== date.getTime())
        : [...prev, date]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.card}>
        <ProgressBar step={3} totalSteps={5} />
        <Text style={styles.title}>Créer un service local</Text>
        <Text style={styles.subtitle}>Étape 3: Disponibilité</Text>

        <Input
          label="Date de début"
          value={startDate}
          onChangeText={setStartDate}
          placeholder="YYYY-MM-DD"
        />

        <Input
          label="Date de fin"
          value={endDate}
          onChangeText={setEndDate}
          placeholder="YYYY-MM-DD"
        />

        <Select
          label="Intervalle"
          value={interval}
          onValueChange={setInterval}
          items={[
            { label: 'Hebdomadaire', value: 'Weekly' },
            { label: 'Mensuel', value: 'Monthly' },
            { label: 'Annuel', value: 'Yearly' }
          ]}
        />

        {showCalendar && (
          <View style={styles.calendarContainer}>
            <Text style={styles.calendarLabel}>Sélectionnez vos jours d'exception</Text>
            <ServiceCalendar
              startDate={new Date(startDate)}
              endDate={new Date(endDate)}
              exceptionDates={exceptionDates}
              onSelectDate={handleSelectDate}
              interval={interval as "Yearly" | "Monthly" | "Weekly"}
            />
          </View>
        )}

        <TouchableOpacity 
          style={styles.button}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>Suivant</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  spacing: {
    height: 60, // Spacing after the back button
  },
  label: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#333',
    color: '#fff', // Set text color to white
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  priceInput: {
    width: 80,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
    textAlign: 'center',
    backgroundColor: '#333',
    color: '#fff', // Set text color to white
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FF3B30', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#FF3B30', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 20,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendarLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
});

export default CreateLocalServiceStep3;
