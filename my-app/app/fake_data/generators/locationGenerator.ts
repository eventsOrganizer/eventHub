import { supabase } from "../../services/supabaseClient";
import { faker } from "@faker-js/faker";
import { getRandomElement } from "../utils/helpers";

const tunisianCities = [
  { city: "Tunis", lat: 36.8065, lng: 10.1815 },
  { city: "Sfax", lat: 34.7400, lng: 10.7600 },
  { city: "Sousse", lat: 35.8333, lng: 10.6333 },
  { city: "Kairouan", lat: 35.6781, lng: 10.0964 },
  { city: "Bizerte", lat: 37.2744, lng: 9.8739 },
  { city: "Gabès", lat: 33.8814, lng: 10.0983 },
  { city: "Ariana", lat: 36.8625, lng: 10.1956 },
  { city: "Gafsa", lat: 34.4250, lng: 8.7842 },
  { city: "La Marsa", lat: 36.8777, lng: 10.3247 },
  { city: "Monastir", lat: 35.7780, lng: 10.8262 }
];

export const generateLocations = async () => {
  try {
    const [{ data: events }, { data: locals }, { data: personals }, { data: materials }] = await Promise.all([
      supabase.from('event').select('id'),
      supabase.from('local').select('id'),
      supabase.from('personal').select('id'),
      supabase.from('material').select('id')
    ]);

    const locations = [];

    const generateLocation = () => {
      const cityData = getRandomElement(tunisianCities);
      return {
        latitude: cityData.lat + (Math.random() - 0.5) * 0.05,
        longitude: cityData.lng + (Math.random() - 0.5) * 0.05
      };
    };

    // Pour les événements
    for (const event of events || []) {
      locations.push({
        event_id: event.id,
        ...generateLocation()
      });
    }

    // Pour les services locaux
    for (const local of locals || []) {
      locations.push({
        local_id: local.id,
        ...generateLocation()
      });
    }

    // Pour les services personnels
    for (const personal of personals || []) {
      locations.push({
        personal_id: personal.id,
        ...generateLocation()
      });
    }

    // Pour les services matériels
    for (const material of materials || []) {
      locations.push({
        material_id: material.id,
        ...generateLocation()
      });
    }

    const { error } = await supabase.from('location').insert(locations);
    if (error) throw error;

    console.log('✅ Localisations générées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des localisations:', error);
    throw error;
  }
};