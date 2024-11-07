import { supabase } from "../../services/supabaseClient";
import { imageUrls } from "../config/images";
import { users } from "../config/users";
import { getRandomElement } from "../utils/helpers";
import { faker } from "@faker-js/faker";

// Fonction pour obtenir plusieurs images aléatoires uniques
const getMultipleImages = (
  images: string[] | undefined, 
  count: number = faker.number.int({ min: 2, max: 4 })
): string[] => {
  if (!images || images.length === 0) return [];
  const selectedImages: string[] = [];
  while (selectedImages.length < count && selectedImages.length < images.length) {
    const img = getRandomElement(images);
    if (!selectedImages.includes(img)) {
      const imageUrl = `${img}?auto=format&fit=crop&w=800&q=80`;
      selectedImages.push(imageUrl);
    }
  }
  return selectedImages;
};

// Fonction pour générer les médias des utilisateurs
const generateUserMedias = async () => {
  const allUsers = [...users.eventCreators, ...users.serviceProviders, ...users.regularUsers];
  
  for (const user of allUsers) {
    const { error } = await supabase.from('media').insert({
      user_id: user.id,
      url: user.avatar,
      type: 'image'
    });
    if (error) throw error;
  }
};

// Fonction pour générer les médias des services
const generateServiceMedias = async () => {
  // Récupérer tous les services
  const [{ data: personals }, { data: locals }, { data: materials }] = await Promise.all([
    supabase.from('personal').select('id, subcategory:subcategory_id(name)'),
    supabase.from('local').select('id, subcategory:subcategory_id(name)'),
    supabase.from('material').select('id, subcategory:subcategory_id(name)')
  ]);

  // Générer les médias pour chaque type de service
  for (const service of personals || []) {
    const subcategoryName = service.subcategory.name.toLowerCase() as keyof typeof imageUrls.services.crew;
    const images = getMultipleImages(imageUrls.services.crew[subcategoryName]);
    for (const url of images) {
      await supabase.from('media').insert({
        personal_id: service.id,
        url,
        type: 'image'
      });
    }
  }

  for (const service of locals || []) {
    const subcategoryName = service.subcategory.name.toLowerCase() as keyof typeof imageUrls.services.local;
    const images = getMultipleImages(imageUrls.services.local[subcategoryName]);
    for (const url of images) {
      await supabase.from('media').insert({
        local_id: service.id,
        url,
        type: 'image'
      });
    }
  }

  for (const service of materials || []) {
    const subcategoryName = service.subcategory.name.toLowerCase() as keyof typeof imageUrls.services.material;
    const images = getMultipleImages(imageUrls.services.material[subcategoryName]);
    for (const url of images) {
      await supabase.from('media').insert({
        material_id: service.id,
        url,
        type: 'image'
      });
    }
  }
};

// Fonction pour générer les médias des événements
const generateEventMedias = async () => {
  const { data: events } = await supabase
    .from('event')
    .select('id, subcategory:subcategory_id(name, category:category_id(name))');

  if (!events) return;

  for (const event of events) {
    const categoryName = event.subcategory.category.name.toLowerCase() as keyof typeof imageUrls.events;
    const subcategoryName = event.subcategory.name.toLowerCase() as keyof (typeof imageUrls.events)[typeof categoryName];
    const images = getMultipleImages(imageUrls.events[categoryName][subcategoryName]);
    
    for (const url of images) {
      await supabase.from('media').insert({
        event_id: event.id,
        url,
        type: 'image'
      });
    }
  }
};

export const generateMedias = async () => {
  try {
    await generateUserMedias();
    await generateServiceMedias();
    await generateEventMedias();
    console.log('✅ Médias générés avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des médias:', error);
    throw error;
  }
};