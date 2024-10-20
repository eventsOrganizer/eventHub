import { supabase } from '../services/supabaseClient';

export type RootStackParamList = {
  Home: undefined;
  ServiceSelection: undefined;
  PersonalsScreen: { category: string };
  ChatList: undefined;
  PersonalDetail: { personalId: number };
  EventDetails: { eventId: number };
  AllEvents: undefined;
  LocalServicesScreen: undefined;
  MaterialsAndFoodServicesScreen: undefined;
  LocalServiceScreen: undefined;
  MaterialServiceDetail: { materialId: number };
  LocalServiceDetails: { localServiceId: number };
  EventCreation: undefined;
};

export const fetchData = async () => {
  const [events, topEvents, locals, staffServices, materialsAndFoodServices] = await Promise.all([
    fetchEvents(),
    fetchTopEvents(),
    fetchLocals(),
    fetchStaffServices(),
    fetchMaterialsAndFoodServices()
  ]);

  return { events, topEvents, locals, staffServices, materialsAndFoodServices };
};

const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('event')
    .select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`);
  if (error) throw new Error(error.message);
  return data || [];
};

const fetchTopEvents = async () => {
  const { data, error } = await supabase
    .from('event')
    .select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`)
    .limit(10);
  if (error) throw new Error(error.message);
  return data || [];
};

const fetchLocals = async () => {
  const { data, error } = await supabase
    .from('local')
    .select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`);
  if (error) throw new Error(error.message);
  return data || [];
};

const fetchStaffServices = async () => {
  const { data, error } = await supabase
    .from('personal')
    .select('*, subcategory (name), media (url)')
    .limit(5);
  if (error) throw new Error(error.message);
  return data || [];
};

const fetchMaterialsAndFoodServices = async () => {
  const { data, error } = await supabase.from('material').select('*').limit(5);
  if (error) throw new Error(error.message);
  return data || [];
};