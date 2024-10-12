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

export async function seedEvents() {
  try {
    // Seed event categories
    const eventCategories = [
      { name: 'Sports', subcategories: ['Tennis', 'Football', 'Swimming', 'Darts'] },
      { name: 'Clubbing', subcategories: ['Techno', 'Hip-Hop', 'Jazz', 'Rock'] },
      { name: 'Science', subcategories: ['Physics', 'Chemistry', 'Biology', 'Astronomy'] },
      { name: 'Technology', subcategories: ['AI', 'Blockchain', 'IoT', 'Robotics'] },
      { name: 'Politics', subcategories: ['Debate', 'Election', 'Policy', 'International Relations'] }
    ];

    for (const category of eventCategories) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('category')
        .insert({ name: category.name, type: 'event' })
        .select();

      if (categoryError) throw categoryError;

      const categoryId = categoryData[0].id;

      const subcategories = category.subcategories.map(subName => ({
        name: subName,
        category_id: categoryId
      }));

      const { error: subcategoryError } = await supabase
        .from('subcategory')
        .insert(subcategories);

      if (subcategoryError) throw subcategoryError;
    }

    // Fetch all subcategories
    const { data: allSubcategories, error: subcategoryError } = await supabase
      .from('subcategory')
      .select('id, name');

    if (subcategoryError) throw subcategoryError;

    // Seed events
    const eventTypes = ['online', 'outdoor', 'indoor'];
    const events = [];

    for (let i = 0; i < 25; i++) {
      const subcategory = allSubcategories[Math.floor(Math.random() * allSubcategories.length)];
      events.push({
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        privacy: i < 23 ? false : true,
        user_id: userIds[Math.floor(Math.random() * userIds.length)],
        details: `This is event number ${i + 1}. It's a ${subcategory.name} event.`,
        subcategory_id: subcategory.id,
        name: `${subcategory.name} Event ${i + 1}`
      });
    }

    const { data: eventData, error: eventError } = await supabase
      .from('event')
      .insert(events)
      .select();

    if (eventError) throw eventError;

    // Seed availability for events
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availabilityData = eventData.map((event: any) => ({
      start: '09:00',
      end: '17:00',
      daysofweek: daysOfWeek[Math.floor(Math.random() * daysOfWeek.length)],
      event_id: event.id,
      date: new Date().toISOString().split('T')[0],
      personal_id: null,
      local_id: null,
      material_id: null
    }));

    const { error: availabilityError } = await supabase
      .from('availability')
      .insert(availabilityData);

    if (availabilityError) throw availabilityError;

    // Seed location for events
    const locationData = eventData.map((event: any) => ({
      longitude: (Math.random() * 360 - 180).toFixed(6),
      latitude: (Math.random() * 180 - 90).toFixed(6),
      event_id: event.id,
      user_id: null,
      local_id: null
    }));

    const { error: locationError } = await supabase
      .from('location')
      .insert(locationData);

    if (locationError) throw locationError;

    // Seed media for events
    const mediaData = eventData.map((event: any) => ({
      event_id: event.id,
      user_id: event.user_id,
      url: `https://example.com/event-images/${event.id}.jpg`,
      personal_id: null,
      local_id: null,
      material_id: null
    }));

    const { error: mediaError } = await supabase
      .from('media')
      .insert(mediaData);

    if (mediaError) throw mediaError;

    console.log('Event data seeded successfully!');
  } catch (error) {
    console.error('Error seeding event data:', error);
  }
}