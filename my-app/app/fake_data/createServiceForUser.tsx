import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";

// Fetch all materials, locals, and personals
const getAllMaterials = async () => {
  const { data, error } = await supabase.from('material').select('id');
  if (error) throw error;
  return data;
};

const getAllLocals = async () => {
  const { data, error } = await supabase.from('local').select('id');
  if (error) throw error;
  return data;
};

const getAllPersonals = async () => {
  const { data, error } = await supabase.from('personal').select('id');
  if (error) throw error;
  return data;
};

// Fetch all users
const getAllUsers = async () => {
  const { data, error } = await supabase.from('user').select('id');
  if (error) throw error;
  return data;
};

// Function to create fake user assignments
export const createUserAssignments = async () => {
  try {
    const [materials, locals, personals, users] = await Promise.all([
      getAllMaterials(),
      getAllLocals(),
      getAllPersonals(),
      getAllUsers(),
    ]);

    const statuses = ['confirmed', 'rejected', 'pending'];

    const materialUserEntries = materials.map(material => ({
      material_id: material.id,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }));

    const localUserEntries = locals.map(local => ({
      local_id: local.id,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }));

    const personalUserEntries = personals.map(personal => ({
      personal_id: personal.id,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }));

    // Insert data into the database
    await supabase.from('material_user').insert(materialUserEntries);
    await supabase.from('local_user').insert(localUserEntries);
    await supabase.from('personal_user').insert(personalUserEntries);

    console.log("User assignments created successfully");
  } catch (error) {
    console.error("Error creating user assignments:", error);
  }
};

