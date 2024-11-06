import { faker } from "@faker-js/faker";
import { getRandomElement } from "../utils/helpers";
import { users } from "../config/users";
import { supabase } from "../../services/supabaseClient";

const getRandomStatus = () => getRandomElement(['pending', 'accepted', 'refused']);

export const generateRequests = async () => {
  try {
    const requests = [];
    
    // Récupérer tous les services avec une limite
    const [{ data: personals }, { data: locals }, { data: materials }] = await Promise.all([
      supabase.from('personal').select('id, user_id').limit(5),
      supabase.from('local').select('id, user_id').limit(5),
      supabase.from('material').select('id, user_id').limit(5)
    ]);

    const { data: availabilities } = await supabase.from('availability').select('id');
    if (!availabilities?.length) throw new Error('Aucune disponibilité trouvée');

    // Générer des demandes pour les services personnels
    for (const personal of personals || []) {
      const numberOfRequests = faker.number.int({ min: 1, max: 2 });
      for (let i = 0; i < numberOfRequests; i++) {
        const requestingUser = getRandomElement([...users.eventCreators, ...users.regularUsers]);
        if (requestingUser.id !== personal.user_id) {
          requests.push({
            user_id: requestingUser.id,
            personal_id: personal.id,
            status: getRandomStatus(),
            created_at: faker.date.past(),
            availability_id: getRandomElement(availabilities).id,
            payment_status: getRandomElement(['pending', 'completed', 'failed']),
            is_read: faker.datatype.boolean(),
            is_action_read: faker.datatype.boolean(),
            seen_by_sender: faker.datatype.boolean(),
            seen_by_receiver: faker.datatype.boolean()
          });
        }
      }
    }

    // Générer des demandes pour les services locaux
    for (const local of locals || []) {
      const numberOfRequests = faker.number.int({ min: 1, max: 2 });
      for (let i = 0; i < numberOfRequests; i++) {
        const requestingUser = getRandomElement([...users.eventCreators, ...users.regularUsers]);
        if (requestingUser.id !== local.user_id) {
          requests.push({
            user_id: requestingUser.id,
            local_id: local.id,
            status: getRandomStatus(),
            created_at: faker.date.past(),
            availability_id: getRandomElement(availabilities).id,
            payment_status: getRandomElement(['pending', 'completed', 'failed']),
            is_read: faker.datatype.boolean(),
            is_action_read: faker.datatype.boolean(),
            seen_by_sender: faker.datatype.boolean(),
            seen_by_receiver: faker.datatype.boolean()
          });
        }
      }
    }

    // Générer des demandes pour les services matériels
    for (const material of materials || []) {
      const numberOfRequests = faker.number.int({ min: 1, max: 2 });
      for (let i = 0; i < numberOfRequests; i++) {
        const requestingUser = getRandomElement([...users.eventCreators, ...users.regularUsers]);
        if (requestingUser.id !== material.user_id) {
          requests.push({
            user_id: requestingUser.id,
            material_id: material.id,
            status: getRandomStatus(),
            created_at: faker.date.past(),
            availability_id: getRandomElement(availabilities).id,
            payment_status: getRandomElement(['pending', 'completed', 'failed']),
            is_read: faker.datatype.boolean(),
            is_action_read: faker.datatype.boolean(),
            seen_by_sender: faker.datatype.boolean(),
            seen_by_receiver: faker.datatype.boolean()
          });
        }
      }
    }

    const { error } = await supabase.from('request').insert(requests);
    if (error) throw error;

    console.log('✅ Demandes générées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des demandes:', error);
    throw error;
  }
};