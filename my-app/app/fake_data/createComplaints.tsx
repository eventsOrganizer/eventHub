import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";

// Fetch all necessary IDs
const getAllIds = async (table: string) => {
  const { data, error } = await supabase.from(table).select('id');
  if (error) throw error;
  return data.map((item: any) => item.id);
};

export const createFakeComplaints = async () => {
  try {
    const [userIds, eventIds, personalIds, materialIds, localIds] = await Promise.all([
      getAllIds('user'),
      getAllIds('event'),
      getAllIds('personal'),
      getAllIds('material'),
      getAllIds('local'),
    ]);

    const statuses = ['pending', 'in_review', 'resolved'];
    const categories = ['user', 'event', 'personal', 'material', 'local', 'other'];

    const complaintsData = Array.from({ length: 50 }).map(() => ({
      user_id: userIds[Math.floor(Math.random() * userIds.length)],
      created_at: faker.date.past().toISOString(),
      resolved_at: Math.random() > 0.5 ? faker.date.recent().toISOString() : null,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      details: faker.lorem.paragraph(),
      category: categories[Math.floor(Math.random() * categories.length)],
      event_id: Math.random() > 0.5 ? eventIds[Math.floor(Math.random() * eventIds.length)] : null,
      personal_id: Math.random() > 0.5 ? personalIds[Math.floor(Math.random() * personalIds.length)] : null,
      material_id: Math.random() > 0.5 ? materialIds[Math.floor(Math.random() * materialIds.length)] : null,
      local_id: Math.random() > 0.5 ? localIds[Math.floor(Math.random() * localIds.length)] : null,
      reported_user_id: Math.random() > 0.5 ? userIds[Math.floor(Math.random() * userIds.length)] : null,
    }));

    const { error } = await supabase.from('complaints').insert(complaintsData);
    if (error) {
      console.error("Error inserting complaints data:", error);
    } else {
      console.log("Complaints data created successfully");
    }
  } catch (error) {
    console.error("Error creating fake complaints:", error);
  }
};