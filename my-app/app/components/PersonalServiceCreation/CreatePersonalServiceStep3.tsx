import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import PriceInput from '../reuseableForCreationService/PriceInput';
import ServiceCalendar from '../reuseableForCreationService/ServiceCalendar';
import { useUser } from '../../UserContext';
import { showAlert } from '../../utils/util';
import { addYears, addMonths, addWeeks, format, parse, isValid } from 'date-fns';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import ProgressBar from '../reuseableForCreationService/ProgressBar';

type CreatePersonalServiceStep3ScreenRouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep3'>;
type CreatePersonalServiceStep3ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep3'>;

const intervals = ['Yearly', 'Monthly', 'Weekly'];

type PriceInputProps = {
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  editable?: boolean;
  style?: object;
};

const CreatePersonalServiceStep3: React.FC = () => {
  const navigation = useNavigation<CreatePersonalServiceStep3ScreenNavigationProp>();
  const route = useRoute<CreatePersonalServiceStep3ScreenRouteProp>();
  const { serviceName, description, images, subcategoryName, subcategoryId } = route.params;
  const { userId } = useUser();

  const [interval, setInterval] = useState<'Yearly' | 'Monthly' | 'Weekly' | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [exceptionDates, setExceptionDates] = useState<Date[]>([]);
  const [pricePerHour, setPricePerHour] = useState('');
  const [depositPercentage, setDepositPercentage] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

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
    if (startDate && endDate && interval && pricePerHour && depositPercentage && exceptionDates.length > 0) {
      navigation.navigate('CreatePersonalServiceStep4', {
        serviceName,
        description,
        subcategoryName,
        subcategoryId,
        images,
        interval: interval || 'Yearly',
        startDate,
        endDate,
        exceptionDates: exceptionDates.map(date => date.toISOString()),
        pricePerHour: parseFloat(pricePerHour),
        depositPercentage: parseFloat(depositPercentage),
      });
    } else {
      showAlert('Erreur', 'Veuillez remplir tous les champs requis et sélectionner au moins une date d\'exception avant de continuer.');
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
        <ProgressBar step={3} totalSteps={4} />
        <Text style={styles.title}>Create New Crew</Text>
        <Text style={styles.subtitle}>Step 3: Availability and Pricing</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price per hour</Text>
          <PriceInput price={pricePerHour} setPrice={setPricePerHour} />
          <Text style={styles.label}>Deposit percentage</Text>
          <PriceInput price={depositPercentage} setPrice={setDepositPercentage} />
          <Text style={styles.label}>Interval</Text>
          <View style={styles.intervalContainer}>
            {intervals.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.intervalButton,
                  interval === item && styles.intervalButtonSelected
                ]}
                onPress={() => setInterval(item as 'Yearly' | 'Monthly' | 'Weekly')}
              >
                <Text style={[
                  styles.intervalButtonText,
                  interval === item && styles.intervalButtonTextSelected
                ]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Start date</Text>
          <PriceInput 
            price={startDate} 
            setPrice={setStartDate} 
            placeholder="YYYY-MM-DD"
            style={styles.whiteInput}
          />
          <Text style={styles.label}>End date</Text>
          <PriceInput 
            price={endDate} 
            setPrice={setEndDate} 
            editable={false} 
            placeholder="YYYY-MM-DD"
            style={styles.whiteInput}
          />
        </View>
        {showCalendar && interval && (
          <View style={styles.calendarContainer}>
            <Text style={styles.calendarLabel}>Sélectionnez vos jours d'exception</Text>
            <View style={styles.calendarWrapper}>
              <ServiceCalendar
                startDate={new Date(startDate)}
                endDate={new Date(endDate)}
                exceptionDates={exceptionDates}
                onSelectDate={handleSelectDate}
                interval={interval}
              />
            </View>
          </View>
        )}
        <TouchableOpacity 
          style={[styles.button, (!startDate || !endDate || !interval || !pricePerHour || !depositPercentage) && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!startDate || !endDate || !interval || !pricePerHour || !depositPercentage}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4c669f',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  intervalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  intervalButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  intervalButtonSelected: {
    backgroundColor: 'white',
  },
  intervalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  intervalButtonTextSelected: {
    color: '#4c669f',
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendarWrapper: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  calendarLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  whiteInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default CreatePersonalServiceStep3;
