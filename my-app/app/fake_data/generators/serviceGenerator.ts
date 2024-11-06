import { faker } from "@faker-js/faker";
import { getRandomElement } from "../utils/helpers";
import { users } from "../config/users";
import { supabase } from "../../services/supabaseClient";
import { generateDateRange } from "../utils/helpers";

// Fonction helper pour générer un prix entier
const getRandomPrice = (min: number, max: number) => {
  return Math.floor(faker.number.int({ min, max }));
};

export const generateServices = async () => {
  try {
    // Générer les services personnels
    const { data: personalSubcats } = await supabase
      .from('subcategory')
      .select('*, category!inner(*)')
      .eq('category.type', 'service')
      .eq('category.name', 'Crew');

    if (!personalSubcats) throw new Error('Aucune sous-catégorie de personnel trouvée');

    // Générer 1 service par sous-catégorie
    const personalServices = personalSubcats.map(subcat => {
      const { startDate, endDate } = generateDateRange();
      return {
        subcategory_id: subcat.id,
        user_id: getRandomElement(users.serviceProviders).id,
        priceperhour: getRandomPrice(20, 200),
        name: faker.person.jobTitle(),
        details: faker.lorem.paragraph(),
        percentage: Math.floor(faker.number.int({ min: 0, max: 100 })),
        startdate: startDate.toISOString().split('T')[0],
        enddate: endDate.toISOString().split('T')[0],
        disabled: faker.datatype.boolean(0.1)
      };
    });

    // Insérer les services personnels
    const { data: insertedPersonals, error: personalError } = await supabase
      .from('personal')
      .insert(personalServices)
      .select();

    if (personalError) throw personalError;
    if (!insertedPersonals) throw new Error('Erreur lors de l\'insertion des services personnels');

    // Générer les services locaux
    const { data: localSubcats } = await supabase
      .from('subcategory')
      .select('*, category!inner(*)')
      .eq('category.type', 'service')
      .eq('category.name', 'Local');

    if (!localSubcats) throw new Error('Aucune sous-catégorie de local trouvée');

    // Générer 1 service par sous-catégorie
    const localServices = localSubcats.map(subcat => {
      const { startDate, endDate } = generateDateRange();
      return {
        subcategory_id: subcat.id,
        user_id: getRandomElement(users.serviceProviders).id,
        priceperhour: getRandomPrice(50, 500),
        name: faker.company.name(),
        details: faker.lorem.paragraph(),
        percentage: Math.floor(faker.number.int({ min: 0, max: 100 })),
        startdate: startDate.toISOString().split('T')[0],
        enddate: endDate.toISOString().split('T')[0],
        disabled: faker.datatype.boolean(0.1)
      };
    });

    // Insérer les services locaux
    const { data: insertedLocals, error: localError } = await supabase
      .from('local')
      .insert(localServices)
      .select();

    if (localError) throw localError;
    if (!insertedLocals) throw new Error('Erreur lors de l\'insertion des services locaux');

    // Générer les services matériels
    const { data: materialSubcats } = await supabase
      .from('subcategory')
      .select('*, category!inner(*)')
      .eq('category.type', 'service')
      .eq('category.name', 'Material');

    if (!materialSubcats) throw new Error('Aucune sous-catégorie de matériel trouvée');

    // Générer 1 service par sous-catégorie
    const materialServices = materialSubcats.map(subcat => {
      const { startDate, endDate } = generateDateRange();
      const sell_or_rent = getRandomElement(['sell', 'rent']);
      
      return {
        subcategory_id: subcat.id,
        user_id: getRandomElement(users.serviceProviders).id,
        quantity: faker.number.int({ min: 1, max: 50 }),
        price: sell_or_rent === 'sell' ? getRandomPrice(10, 1000) : null,
        price_per_hour: sell_or_rent === 'rent' ? getRandomPrice(5, 100) : null,
        sell_or_rent,
        name: faker.commerce.productName(),
        details: faker.lorem.paragraph(),
        percentage: Math.floor(faker.number.int({ min: 0, max: 100 })),
        startdate: sell_or_rent === 'rent' ? startDate.toISOString().split('T')[0] : null,
        enddate: sell_or_rent === 'rent' ? endDate.toISOString().split('T')[0] : null,
        disabled: faker.datatype.boolean(0.1)
      };
    });

    // Insérer les services matériels
    const { data: insertedMaterials, error: materialError } = await supabase
      .from('material')
      .insert(materialServices)
      .select();

    if (materialError) throw materialError;
    if (!insertedMaterials) throw new Error('Erreur lors de l\'insertion des services matériels');

    console.log('✅ Services générés avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des services:', error);
    throw error;
  }
};