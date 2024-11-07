import { supabase } from "../../services/supabaseClient";
import { faker } from "@faker-js/faker";
import { users } from "../config/users";
import { imageUrls } from "../config/images";

export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomDate = (start: Date, end: Date): string => {
  return faker.date.between({ from: start, to: end }).toISOString();
};

export const getRandomPrice = (min: number, max: number): number => {
  return Math.floor(faker.number.float({ min, max }) * 100) / 100;
};

export const getRandomStatus = (): string => {
  return getRandomElement(['pending', 'confirmed', 'rejected', 'cancelled']);
};

export const getServiceImages = (type: string, subtype: string): string[] => {
  const serviceType = type.toLowerCase();
  const serviceSubtype = subtype.toLowerCase().replace(/\s+/g, '');
  
  if (serviceType === 'event') {
    const images = imageUrls.events[serviceSubtype as keyof typeof imageUrls.events];
    return Array.isArray(images) ? images : [];
  }
  
  return imageUrls.services[serviceType as keyof typeof imageUrls.services][
    serviceSubtype as keyof (typeof imageUrls.services[keyof typeof imageUrls.services])
  ];
};

export const generateDateRange = () => {
  const startDate = faker.date.future({ years: 1 });
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + faker.number.int({ min: 1, max: 30 }));
  
  return { startDate, endDate };
};

export const generateTimeSlot = () => {
  const startHour = faker.number.int({ min: 8, max: 20 });
  const endHour = faker.number.int({ min: startHour + 1, max: Math.min(startHour + 8, 23) });
  
  return {
    start: `${String(startHour).padStart(2, '0')}:00`,
    end: `${String(endHour).padStart(2, '0')}:00`
  };
};

export const generateQuantity = (min: number = 1, max: number = 100): number => {
  return faker.number.int({ min, max });
};