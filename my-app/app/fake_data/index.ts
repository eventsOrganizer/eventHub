import { generateCategories } from './generators/categoryGenerator';
import { generateServices } from './generators/serviceGenerator';
import { generateEvents } from './generators/eventGenerator';
import { generateAvailabilities } from './generators/availabilityGenerator';
import { generateRequests } from './generators/requestGenerator';
import { generateLocations } from './generators/locationGenerator';
import { faker } from "@faker-js/faker";
import { supabase } from '../services/supabaseClient';
import { generateMedias } from './generators/mediaGenerator';

export const resetDatabase = async () => {
  try {
    console.log('🗑️ Nettoyage des données...');
    
    // Vérifier l'état initial
    const counts = await checkTableCounts();
    console.log('État initial des tables:', counts);

    // Première vague : tables les plus dépendantes
    console.log('Suppression des tables dépendantes...');
    await Promise.all([
      supabase.from('media').delete().neq('id', -1).then(logDeletion('media')),
      supabase.from('request').delete().neq('id', -1).then(logDeletion('request')),
      supabase.from('availability').delete().neq('id', -1).then(logDeletion('availability')),
      supabase.from('location').delete().neq('id', -1).then(logDeletion('location')),
      supabase.from('comment').delete().neq('id', -1).then(logDeletion('comment')),
      supabase.from('review').delete().neq('id', -1).then(logDeletion('review')),
      supabase.from('like').delete().neq('id', -1).then(logDeletion('like')),
      supabase.from('order').delete().neq('id', -1).then(logDeletion('order')),
      supabase.from('interest').delete().neq('id', -1).then(logDeletion('interest')),
      supabase.from('videoroom').delete().neq('id', -1).then(logDeletion('videoroom'))
    ]);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Deuxième vague : services et événements
    console.log('Suppression des services et événements...');
    await Promise.all([
      supabase.from('event').delete().neq('id', -1).then(logDeletion('event')),
      supabase.from('personal').delete().neq('id', -1).then(logDeletion('personal')),
      supabase.from('local').delete().neq('id', -1).then(logDeletion('local')),
      supabase.from('material').delete().neq('id', -1).then(logDeletion('material'))
    ]);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Troisième vague : catégories
    console.log('Suppression des catégories...');
    await supabase.from('subcategory').delete().neq('id', -1).then(logDeletion('subcategory'));
    await new Promise(resolve => setTimeout(resolve, 1000));
    await supabase.from('category').delete().neq('id', -1).then(logDeletion('category'));

    // Vérifier l'état final
    const finalCounts = await checkTableCounts();
    console.log('État final des tables:', finalCounts);

    console.log('✅ Données nettoyées avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des données:', error);
    throw error;
  }
};

// Fonction helper pour vérifier le nombre d'enregistrements dans chaque table
const checkTableCounts = async () => {
  const tables = ['media', 'request', 'availability', 'location', 'event', 
                 'personal', 'local', 'material', 'subcategory', 'category'];
  const counts: Record<string, number> = {};
  
  for (const table of tables) {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    counts[table] = count || 0;
  }
  
  return counts;
};

// Fonction helper pour logger les suppressions
const logDeletion = (table: string) => ({ error, count }: any) => {
  if (error) {
    console.error(`Erreur lors de la suppression de ${table}:`, error);
  } else {
    console.log(`${count || 0} enregistrements supprimés de ${table}`);
  }
};

export const generateData = async () => {
  try {
    await generateCategories();
    await generateServices();
    await generateEvents();
    await generateLocations();
    await generateAvailabilities();
    await generateRequests();
    await generateMedias();

    console.log('✨ Génération des données terminée avec succès!');
    return true;
  } catch (error) {
    console.error('💥 Erreur lors de la génération des données:', error);
    throw error;
  }
};