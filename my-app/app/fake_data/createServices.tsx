import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";

import { getAllUsers } from "./helpers/geAllUsers";
import { getSubcategoriesByCategory } from "./helpers/getAllSubCategories";
export const createService = async (category: string) => {



  const subcategories = await getSubcategoriesByCategory(category);
  const subcategoryIds = subcategories.map((sub: any) => sub.id);

  // Fetch all users
  const users = await getAllUsers();
  const userIds = users.map((user: any) => user.id);

  // Create personnel rows
  const personnelData = subcategoryIds.map((subcategoryId: any, index: any) => ({
    subcategory_id: subcategoryId,
    user_id: userIds[index % userIds.length], // Assign users in a round-robin fashion
    priceperhour: Math.floor(Math.random() * 100) + 20, // Random price between 20 and 120
    name: `Personnel ${index + 1}`,
    details: `Details for Personnel ${index + 1}`,
  }));

  // Insert personnel data into the database
  const { error: personnelError } = await supabase
    .from("personal")
    .insert(personnelData);
  if (personnelError) {
    console.error("Error inserting personnel data:", personnelError);
    return;
  }
  console.log("Personnel data created successfully");

  // Create local rows
  const localData = subcategoryIds.map((subcategoryId: any, index: any) => ({
    subcategory_id: subcategoryId,
    user_id: userIds[index % userIds.length], // Assign users in a round-robin fashion
    priceperhour: Math.floor(Math.random() * 100) + 20, // Random price between 20 and 120
    
  }));

  // Insert local data into the database
  const { error: localError } = await supabase.from("local").insert(localData);
  if (localError) {
    console.error("Error inserting local data:", localError);
    return;
  }
  console.log("Local data created successfully");

  // Create material rows
  const materialData = subcategoryIds.map((subcategoryId: any, index: any) => ({
    subcategory_id: subcategoryId,
    user_id: userIds[index % userIds.length], // Assign users in a round-robin fashion
    quantity: Math.floor(Math.random() * 50) + 1, // Random quantity between 1 and 50
    price: Math.floor(Math.random() * 100) + 10, // Random price between 10 and 110
    name: faker.commerce.productName(),
    details: faker.commerce.productDescription(),
  }));

  // Insert material data into the database
  const { error: materialError } = await supabase
    .from("material")
    .insert(materialData);
  if (materialError) {
    console.error("Error inserting material data:", materialError);
    return;
  }
  console.log("Material data created successfully");
};

// Example usage
export const createDataForAllCategories = async () => {
  await createService("Crew");
  await createService("Product");
  await createService("Spaces");
};
