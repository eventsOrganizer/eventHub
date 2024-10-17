import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import RNPickerSelect from 'react-native-picker-select';
import { RootStackParamList } from '../../navigation/types';
import ServiceCalendar from './ServiceCalendar';
import { useUser } from '../../UserContext';
import { showAlert } from '../../utils/util';
import { addWeeks, addMonths, addYears, parse, isValid, format } from 'date-fns';

type CreatePersonalServiceStep3ScreenRouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep3'>;
type CreatePersonalServiceStep3ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep3'>;

const CreatePersonalServiceStep3: React.FC = () => {
  const route = useRoute<CreatePersonalServiceStep3ScreenRouteProp>();
  const navigation = useNavigation<CreatePersonalServiceStep3ScreenNavigationProp>();
  const { serviceName, description, images, subcategoryName, subcategoryId } = route.params;
  const { userId } = useUser();

  const [interval, setInterval] = useState<'Yearly' | 'Monthly' | 'Weekly' | null>(null);
  const [startDateInput, setStartDateInput] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [exceptionDates, setExceptionDates] = useState<Date[]>([]);
  const [pricePerHour, setPricePerHour] = useState('');
  const [depositPercentage, setDepositPercentage] = useState('');

  const handleIntervalChange = (value: 'Yearly' | 'Monthly' | 'Weekly' | null) => {
    setInterval(value);
    if (startDate) {
      calculateEndDate(startDate, value);
    }
  };

  const calculateEndDate = (start: string, intervalValue: 'Yearly' | 'Monthly' | 'Weekly' | null) => {
    if (!start || !intervalValue) return;

    const startDateObj = parse(start, 'yyyy-MM-dd', new Date());
    if (!isValid(startDateObj)) return;

    let endDateObj;

    switch (intervalValue) {
      case 'Weekly':
        endDateObj = addWeeks(startDateObj, 1);
        break;
      case 'Monthly':
        endDateObj = addMonths(startDateObj, 1);
        break;
      case 'Yearly':
        endDateObj = addYears(startDateObj, 1);
        break;
      default:
        return;
    }

    setEndDate(format(endDateObj, 'yyyy-MM-dd'));
  };

  const handleStartDateChange = (text: string) => {
    setStartDateInput(text);
    if (text.length === 10) {
      validateAndSetStartDate(text);
    }
  };

  const validateAndSetStartDate = (date: string) => {
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate)) {
      setStartDate(date);
      if (interval) {
        calculateEndDate(date, interval);
      }
    } else {
      showAlert('Erreur', 'Format de date invalide. Veuillez utiliser AAAA-MM-JJ.');
    }
  };

  const toggleDateSelection = (date: Date) => {
    setExceptionDates(prevDates => {
      const dateString = date.toISOString().split('T')[0];
      if (prevDates.some(d => d.toISOString().split('T')[0] === dateString)) {
        return prevDates.filter(d => d.toISOString().split('T')[0] !== dateString);
      } else {
        return [...prevDates, date];
      }
    });
  };

  const handleNext = useCallback(() => {
    if (!startDate || !endDate || !interval || !userId || !pricePerHour || !depositPercentage) {
      showAlert('Erreur', 'Veuillez remplir tous les champs et vous assurer d\'être connecté.');
      return;
    }

    navigation.navigate('CreatePersonalServiceStep5', {
      serviceName,
      description,
      subcategoryName,
      subcategoryId,
      images,
      interval,
      startDate,
      endDate,
      exceptionDates: exceptionDates.map(date => date.toISOString()),
      pricePerHour: parseFloat(pricePerHour),
      depositPercentage: parseFloat(depositPercentage),
    });
  }, [navigation, serviceName, description, subcategoryName, subcategoryId, images, interval, startDate, endDate, exceptionDates, pricePerHour, depositPercentage, userId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Prix par heure</Text>
      <TextInput
        style={styles.input}
        value={pricePerHour}
        onChangeText={setPricePerHour}
        keyboardType="numeric"
        placeholder="Entrez le prix par heure"
      />

      <Text style={styles.label}>Pourcentage de dépôt</Text>
      <TextInput
        style={styles.input}
        value={depositPercentage}
        onChangeText={setDepositPercentage}
        keyboardType="numeric"
        placeholder="Entrez le pourcentage de dépôt"
      />

      <Text style={styles.label}>Intervalle de disponibilité</Text>
      <RNPickerSelect
        onValueChange={handleIntervalChange}
        items={[
          { label: 'Annuel', value: 'Yearly' },
          { label: 'Mensuel', value: 'Monthly' },
          { label: 'Hebdomadaire', value: 'Weekly' },
        ]}
        style={pickerSelectStyles}
        value={interval}
        placeholder={{ label: "Sélectionnez un intervalle", value: null }}
      />

<Text style={styles.label}>Date de début (AAAA-MM-JJ)</Text>
      <TextInput
        style={styles.input}
        value={startDateInput}
        onChangeText={handleStartDateChange}
        placeholder="AAAA-MM-JJ"
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={styles.label}>Date de fin</Text>
      <TextInput
        style={styles.input}
        value={endDate}
        editable={false}
        placeholder="Calculée automatiquement"
      />

      {startDate && endDate && interval && (
        <ServiceCalendar
          startDate={new Date(startDate)}
          endDate={new Date(endDate)}
          exceptionDates={exceptionDates}
          onSelectDate={toggleDateSelection}
          interval={interval}
        />
      )}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Suivant</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  nextButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  nextButtonText: { color: 'white', fontWeight: 'bold' },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
});

export default CreatePersonalServiceStep3;