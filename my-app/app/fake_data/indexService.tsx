const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const userIds = [
  '1f08596e-d95f-4835-8911-4208e08b19e8',
  '3210f3ef-39ce-4623-a47c-290bec93bda3',
  '3d5c0526-5950-4a9e-9bed-251a50ee8a8b',
  '76f0905b-f8cd-4b25-a598-aa6fa838c86a',
  '791cbcb4-d6f2-4299-b6b9-3d954e3362ca',
  '812aadfa-d19f-4be1-bd36-e37c3ebdd010',
  'e77190e7-4fc6-4a8f-858d-5d8280dae6f6',
  'f6d42a11-bf8b-4bfa-9074-5668eb41bad6',
];

export async function seedDatabase() {
  try {
    // Seed categories
    const { data: categories, error: categoryError } = await supabase
      .from('category')
      .insert([
        { name: 'Personal', type: 'service' },
        { name: 'Local', type: 'service' },
        { name: 'Material', type: 'service' }
      ])
      .select();

    if (categoryError) throw categoryError;

    // Seed subcategories
    const subcategories = [
      { name: 'Security', category_id: categories[0].id },
      { name: 'Waiter', category_id: categories[0].id },
      { name: 'Cooker', category_id: categories[0].id },
      { name: 'Restaurant', category_id: categories[1].id },
      { name: 'Mansion', category_id: categories[1].id },
      { name: 'Hotel', category_id: categories[1].id },
      { name: 'Audio Visual', category_id: categories[2].id },
      { name: 'Furniture', category_id: categories[2].id },
      { name: 'Plates', category_id: categories[2].id }
    ];

    const { data: subCats, error: subCatError } = await supabase
      .from('subcategory')
      .insert(subcategories)
      .select();

    if (subCatError) throw subCatError;

    // Seed personal services
    const personalServices = [
      { subcategory_id: subCats[0].id, user_id: userIds[0], priceperhour: 2000, name: 'John Doe Security', details: 'Experienced security guard' },
      { subcategory_id: subCats[0].id, user_id: userIds[1], priceperhour: 2200, name: 'Jane Smith Security', details: 'Professional security services' },
      { subcategory_id: subCats[0].id, user_id: userIds[2], priceperhour: 2500, name: 'Mike Johnson Security', details: 'Highly trained security personnel' },
      { subcategory_id: subCats[1].id, user_id: userIds[3], priceperhour: 1500, name: 'Emily Brown Waiter', details: 'Experienced waiter for events' },
      { subcategory_id: subCats[1].id, user_id: userIds[4], priceperhour: 1800, name: 'David Lee Waiter', details: 'Professional waiter service' },
      { subcategory_id: subCats[1].id, user_id: userIds[5], priceperhour: 2000, name: 'Sarah Wilson Waiter', details: 'High-end waiter for special occasions' },
      { subcategory_id: subCats[2].id, user_id: userIds[6], priceperhour: 3000, name: 'Robert Taylor Cook', details: 'Experienced chef for all cuisines' },
      { subcategory_id: subCats[2].id, user_id: userIds[7], priceperhour: 3500, name: 'Lisa Anderson Cook', details: 'Gourmet chef for special events' },
      { subcategory_id: subCats[2].id, user_id: userIds[0], priceperhour: 4000, name: 'Christopher Martin Cook', details: 'Award-winning chef for hire' }
    ];

    const { data: personalData, error: personalError } = await supabase
      .from('personal')
      .insert(personalServices)
      .select();

    if (personalError) throw personalError;

    // Seed local services
    const localServices = [
      { subcategory_id: subCats[3].id, user_id: userIds[1], priceperhour: 20000, name: 'Elegant Eats Restaurant', details: 'Fine dining experience' },
      { subcategory_id: subCats[3].id, user_id: userIds[2], priceperhour: 25000, name: 'Gourmet Grove Restaurant', details: 'Exquisite culinary delights' },
      { subcategory_id: subCats[3].id, user_id: userIds[3], priceperhour: 30000, name: 'Culinary Castle Restaurant', details: 'Royal dining experience' },
      { subcategory_id: subCats[4].id, user_id: userIds[4], priceperhour: 50000, name: 'Luxe Living Mansion', details: 'Opulent mansion for events' },
      { subcategory_id: subCats[4].id, user_id: userIds[5], priceperhour: 60000, name: 'Opulent Oasis Mansion', details: 'Lavish estate for gatherings' },
      { subcategory_id: subCats[4].id, user_id: userIds[6], priceperhour: 70000, name: 'Majestic Manor Mansion', details: 'Grand mansion for special occasions' },
      { subcategory_id: subCats[5].id, user_id: userIds[7], priceperhour: 15000, name: 'Sunset Suites Hotel', details: 'Comfortable hotel with scenic views' },
      { subcategory_id: subCats[5].id, user_id: userIds[0], priceperhour: 20000, name: 'Urban Oasis Hotel', details: 'Modern hotel in the city center' },
      { subcategory_id: subCats[5].id, user_id: userIds[1], priceperhour: 25000, name: 'Skyline Retreat Hotel', details: 'Luxurious hotel with panoramic views' }
    ];

    const { data: localData, error: localError } = await supabase
      .from('local')
      .insert(localServices)
      .select();

    if (localError) throw localError;

    // Seed material services
    const materialServices = [
      { subcategory_id: subCats[6].id, user_id: userIds[2], quantity: 5, price: 10000, price_per_hour: 2000, sell_or_rent: 'rent', name: 'Pro Sound System', details: 'High-quality audio equipment for events' },
      { subcategory_id: subCats[6].id, user_id: userIds[3], quantity: 3, price: 20000, price_per_hour: 3000, sell_or_rent: 'rent', name: '4K Projector Set', details: 'Crystal clear visual projection for presentations' },
      { subcategory_id: subCats[6].id, user_id: userIds[4], quantity: 10, price: 5000, price_per_hour: 1000, sell_or_rent: 'rent', name: 'LED Stage Lights', details: 'Colorful lighting for stage performances' },
      { subcategory_id: subCats[7].id, user_id: userIds[5], quantity: 50, price: 1000, price_per_hour: 200, sell_or_rent: 'rent', name: 'Elegant Chairs', details: 'Comfortable seating for events' },
      { subcategory_id: subCats[7].id, user_id: userIds[6], quantity: 10, price: 5000, price_per_hour: 1000, sell_or_rent: 'rent', name: 'Banquet Tables', details: 'Large tables for dining events' },
      { subcategory_id: subCats[7].id, user_id: userIds[7], quantity: 5, price: 10000, price_per_hour: 2000, sell_or_rent: 'rent', name: 'Lounge Sofas', details: 'Stylish sofas for VIP areas' },
      { subcategory_id: subCats[8].id, user_id: userIds[0], quantity: 200, price: 200, price_per_hour: 50, sell_or_rent: 'rent', name: 'Fine China Plates', details: 'Elegant plates for upscale events' },
      { subcategory_id: subCats[8].id, user_id: userIds[1], quantity: 200, price: 100, price_per_hour: 25, sell_or_rent: 'rent', name: 'Stemware Set', details: 'Crystal glasses for beverages' },
      { subcategory_id: subCats[8].id, user_id: userIds[2], quantity: 200, price: 150, price_per_hour: 30, sell_or_rent: 'rent', name: 'Silver Cutlery Set', details: 'High-quality utensils for dining' }
    ];

    const { data: materialData, error: materialError } = await supabase
      .from('material')
      .insert(materialServices)
      .select();

    if (materialError) throw materialError;

    // Seed availability for all services
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const currentDate = new Date().toISOString().split('T')[0];

    const availabilityData = [
      ...personalData.flatMap((personal: any) => daysOfWeek.map(day => ({
        start: '09:00',
        end: '17:00',
        daysofweek: day,
        personal_id: personal.id,
        date: currentDate
      }))),
      ...localData.flatMap((local: any) => daysOfWeek.map(day => ({
        start: '09:00',
        end: '17:00',
        daysofweek: day,
        local_id: local.id,
        date: currentDate
      }))),
      ...materialData.flatMap((material: any) => daysOfWeek.map(day => ({
        start: '09:00',
        end: '17:00',
        daysofweek: day,
        material_id: material.id,
        date: currentDate
      })))
    ];

    const { error: availabilityError } = await supabase
      .from('availability')
      .insert(availabilityData);

    if (availabilityError) throw availabilityError;

    // Seed location for local services
    const locationData = localData.map((local: any) => ({
      longitude: Math.floor(Math.random() * 360000 - 180000) / 1000,
      latitude: Math.floor(Math.random() * 180000 - 90000) / 1000,
      local_id: local.id
    }));

    const { error: locationError } = await supabase
      .from('location')
      .insert(locationData);

    if (locationError) throw locationError;

    // Seed media for all services
    const mediaData = [
      ...personalData.map((personal: any) => ({
        personal_id: personal.id,
        user_id: personal.user_id,
        url: `https://example.com/personal/${personal.id}.jpg`
      })),
      ...localData.map((local: any)  => ({
        local_id: local.id,
        user_id: local.user_id,
        url: `https://example.com/local/${local.id}.jpg`
      })),
      ...materialData.map((material: any) => ({
        material_id: material.id,
        user_id: material.user_id,
        url: `https://example.com/material/${material.id}.jpg`
      }))
    ];

    const { error: mediaError } = await supabase
      .from('media')
      .insert(mediaData);

    if (mediaError) throw mediaError;

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
