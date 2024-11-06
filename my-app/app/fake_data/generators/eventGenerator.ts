import { faker } from "@faker-js/faker";
import { getRandomElement } from "../utils/helpers";
import { users } from "../config/users";
import { supabase } from "../../services/supabaseClient";
import { imageUrls } from "../config/images";

const generateUniqueSerial = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return (timestamp + randomStr).slice(0, 20);
};

// Fonction pour obtenir les images d'événement
const getEventImages = (categoryName: string, subcategoryName: string) => {
  const catKey = categoryName.toLowerCase().replace(/\s+/g, '') as keyof typeof imageUrls.events;
  const subcatKey = subcategoryName.toLowerCase().replace(/\s+/g, '') as keyof (typeof imageUrls.events)[typeof catKey];
  return getMultipleImages(imageUrls.events[catKey][subcatKey]);
};

// Fonction pour obtenir plusieurs images aléatoires uniques
const getMultipleImages = (images: string[] | undefined, count: number = faker.number.int({ min: 2, max: 4 })) => {
  if (!images || images.length === 0) return [];
  const selectedImages: string[] = [];
  while (selectedImages.length < count && selectedImages.length < images.length) {
    const img = getRandomElement(images);
    if (!selectedImages.includes(img)) {
      selectedImages.push(img);
    }
  }
  return selectedImages;
};

// Fonction pour insérer les médias dans la table media
const insertMediaForEvent = async (eventId: number, urls: string[]) => {
  const mediaRecords = urls.map(url => ({
    event_id: eventId,
    url,
    type: 'image'
  }));

  const { error } = await supabase.from('media').insert(mediaRecords);
  if (error) throw error;
};

export const generateEvents = async () => {
  try {
    const { data: eventSubcats } = await supabase
      .from('subcategory')
      .select('*, category!inner(*)')
      .eq('category.type', 'event')
      .limit(5); // Limiter à 5 sous-catégories

    if (!eventSubcats) throw new Error('Aucune sous-catégorie d\'événement trouvée');

    const events = [];
    const usedSerials = new Set();

    for (let i = 0; i < 20; i++) {
      const subcategory = getRandomElement(eventSubcats);
      let serial;
      
      do {
        serial = generateUniqueSerial();
      } while (usedSerials.has(serial));
      
      usedSerials.add(serial);
      
      events.push({
        subcategory_id: subcategory.id,
        user_id: getRandomElement(users.eventCreators).id,
        name: faker.company.catchPhrase(),
        details: faker.lorem.paragraphs(2),
        type: getRandomElement(['online', 'outdoor', 'indoor']),
        privacy: faker.datatype.boolean(),
        serial,
        disabled: faker.datatype.boolean(0.1),
        created_at: faker.date.past(),
        group_id: null
      });
    }

    // Insérer les événements et leurs médias
    for (const event of events) {
      const { data: insertedEvent, error } = await supabase
        .from('event')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      if (!insertedEvent) throw new Error('Erreur lors de l\'insertion de l\'événement');

      const subcategory = eventSubcats.find(s => s.id === event.subcategory_id);
      if (subcategory) {
        const images = getEventImages(subcategory.category.name, subcategory.name);
        await insertMediaForEvent(insertedEvent.id, images);
      }
    }

    console.log('✅ Événements générés avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des événements:', error);
    throw error;
  }
};