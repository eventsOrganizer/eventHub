import { supabase } from '../../services/supabaseClient';

interface ServicePricing {
  price?: number;
  priceperhour?: number;
  price_per_hour?: number;
  sell_or_rent?: 'sell' | 'rent';
  percentage?: number;
}

const getServicePriceFields = (serviceType: string): string => {
  switch (serviceType.toLowerCase()) {
    case 'personal':
    case 'local':
      return 'priceperhour, percentage';
    case 'material':
      return 'price, price_per_hour, sell_or_rent, percentage';
    default:
      throw new Error(`Invalid service type: ${serviceType}`);
  }
};

const fetchServiceData = async (serviceId: number, serviceType: string): Promise<ServicePricing | null> => {
  try {
    const priceFields = getServicePriceFields(serviceType);
    const { data, error } = await supabase
      .from(serviceType.toLowerCase())
      .select(priceFields)
      .eq('id', serviceId)
      .single();

    if (error) {
      console.error(`Error fetching ${serviceType} data:`, error);
      return null;
    }
    if (!data) return null;

    return data as ServicePricing;
  } catch (error) {
    console.error(`Error fetching ${serviceType} data:`, error);
    return null;
  }
};

export const calculateHours = (start?: string, end?: string): number => {
  if (!start || !end || start === 'Not specified' || end === 'Not specified') return 0;
  
  try {
    // Utiliser une date fixe pour éviter les problèmes de changement de jour
    const baseDate = '2000-01-01';
    const startTime = new Date(`${baseDate}T${start}`);
    const endTime = new Date(`${baseDate}T${end}`);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new Error('Invalid time format');
    }
    
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    
    // S'assurer que le nombre d'heures est positif et arrondi à 2 décimales
    return Math.max(0, Math.round(hours * 100) / 100);
  } catch (error) {
    console.error('Error calculating hours:', error);
    return 0;
  }
};

export const calculateTotalPrice = async (
  serviceId: number, 
  serviceType: string,
  start?: string,
  end?: string
): Promise<number> => {
  try {
    const serviceData = await fetchServiceData(serviceId, serviceType);
    if (!serviceData) return 0;

    const hours = calculateHours(start, end);
    console.log('Calculated hours:', hours);

    if (serviceType.toLowerCase() === 'material') {
      if (serviceData.sell_or_rent === 'sell') {
        return serviceData.price || 0;
      }
      return hours * (serviceData.price_per_hour || 0);
    }

    return hours * (serviceData.priceperhour || 0);
  } catch (error) {
    console.error('Error calculating total price:', error);
    return 0;
  }
};

export const calculateAdvancePayment = async (
  serviceId: number, 
  serviceType: string,
  start?: string,
  end?: string
): Promise<number> => {
  try {
    const serviceData = await fetchServiceData(serviceId, serviceType);
    if (!serviceData) return 0;

    const totalPrice = await calculateTotalPrice(serviceId, serviceType, start, end);

    if (serviceType.toLowerCase() === 'material' && serviceData.sell_or_rent === 'sell') {
      return totalPrice;
    }

    return (totalPrice * (serviceData.percentage || 0)) / 100;
  } catch (error) {
    console.error('Error calculating advance payment:', error);
    return 0;
  }
};