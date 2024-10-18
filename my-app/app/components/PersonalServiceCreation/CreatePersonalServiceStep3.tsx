import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import PriceInput from '../reuseableForCreationService/PriceInput';
import ServiceCalendar from '../reuseableForCreationService/ServiceCalendar';
import IntervalSelector from '../reuseableForCreationService/IntervalSelector';
import DateInput from '../reuseableForCreationService/DateInput';
import { useUser } from '../../UserContext';
import { showAlert } from '../../utils/util';

type CreatePersonalServiceStep3ScreenRouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep3'>;
type CreatePersonalServiceStep3ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep3'>;

const CreatePersonalServiceStep3: React.FC = () => {
  const route = useRoute<CreatePersonalServiceStep3ScreenRouteProp>();
  const navigation = useNavigation<CreatePersonalServiceStep3ScreenNavigationProp>();
  const { serviceName, description, images, subcategoryName, subcategoryId } = route.params;
  const { userId } = useUser();

  const [interval, setInterval] = useState<'Yearly' | 'Monthly' | 'Weekly' | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [exceptionDates, setExceptionDates] = useState<Date[]>([]);
  const [pricePerHour, setPricePerHour] = useState('');
  const [depositPercentage, setDepositPercentage] = useState('');

  const handleNext = () => {
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
  };

  return (
    <ScrollView style={styles.container}>
      <PriceInput price={pricePerHour} setPrice={setPricePerHour} label="Prix par heure" />
      <PriceInput price={depositPercentage} setPrice={setDepositPercentage} label="Pourcentage de dépôt" />
      <IntervalSelector interval={interval} setInterval={setInterval} />
      <DateInput label="Date de début" date={startDate} setDate={setStartDate} />
      <DateInput label="Date de fin" date={endDate} setDate={setEndDate} editable={false} />
      {startDate && endDate && interval && (
        <ServiceCalendar
          startDate={new Date(startDate)}
          endDate={new Date(endDate)}
          exceptionDates={exceptionDates}
          onSelectDate={(date) => {
            setExceptionDates(prev => 
              prev.some(d => d.toDateString() === date.toDateString())
                ? prev.filter(d => d.toDateString() !== date.toDateString())
                : [...prev, date]
            );
          }}
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
  nextButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  nextButtonText: { color: 'white', fontWeight: 'bold' },
});

export default CreatePersonalServiceStep3;