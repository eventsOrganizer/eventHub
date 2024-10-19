import React, { useState, useEffect } from 'react';
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
import { addYears, addMonths, addWeeks, format, parse, isValid } from 'date-fns';

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
  const [showCalendar, setShowCalendar] = useState(false);

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
        showAlert('Error', 'Invalid start date. Please use the format YYYY-MM-DD.');
      }
    } else {
      setShowCalendar(false);
    }
  }, [startDate, interval]);

  const handleNext = () => {
    if (!startDate || !endDate || !interval || !userId || !pricePerHour || !depositPercentage) {
      showAlert('Error', 'Please fill in all fields and make sure you are logged in.');
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
      <View style={styles.card}>
        <Text style={styles.title}>Create a Personal Service</Text>
        <Text style={styles.subtitle}>Step 3: Availability and Pricing</Text>
        <PriceInput price={pricePerHour} setPrice={setPricePerHour} label="Price per hour" />
        <PriceInput price={depositPercentage} setPrice={setDepositPercentage} label="Deposit percentage" />
        <IntervalSelector interval={interval} setInterval={setInterval} />
        <DateInput label="Start date" date={startDate} setDate={setStartDate} />
        <DateInput label="End date" date={endDate} setDate={setEndDate} editable={false} />
        {showCalendar && interval && (
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
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreatePersonalServiceStep3;