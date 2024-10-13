import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";

export const createSeviceCategory = async () => {
  // Define event categories and their subcategories
  const eventCategories = [
    {
      name: "Product",
      subcategories: [
        "Audio/Visual Equipment",
        "Stage Equipment",
        "Furniture",
        "Tents and Shelters",
        "Catering Equipment",
        "Decorative Items",
        "Transport & Mobility",
        "Electrical Equipment",
        "Safety Equipment",
        "Exhibition Stands & Booths",
        "Event Planning",   
      ],
    },

    {
      name: "Crew",
      subcategories: [
        "Catering Services",
        "Security Personnel",
        "Technical Support",
        "Entertainment & Performers",
        "Transport & Logistics",
        "Cleaning & Maintenance",
        "Decor & Design",
        "Photography & Videography",
        "Health & Safety Services",
      ],
    },
    {
      name: "Spaces",
      subcategories: [
        "Venue Management",
        "Conference Halls",
        "Outdoor Spaces",
        "Banquet Halls",
        "Stadiums & Arenas",
        "Meeting Rooms",
        "Exhibition Centers",
        "Theaters & Auditoriums",
        "Hotels & Resorts",
        "Private Properties & Estates", 
      ],
    
    },
  ];

  // Insert categories and their subcategories into the database
  for (const category of eventCategories) {
    // Insert category
    const { data: categoryData, error: categoryError } = await supabase
      .from("category")
      .insert([{ name: category.name, type: "service" }])
      .select();

    if (categoryError) {
      console.error(
        `Error inserting category ${category.name}:`,
        categoryError
      );
      continue;
    }

    const categoryId = categoryData[0].id; // Get the inserted category ID

    // Prepare subcategories for insertion
    const subcategories = category.subcategories.map((sub) => ({
      name: sub,
      category_id: categoryId,
    }));

    // Insert subcategories
    const { error: subcategoryError } = await supabase
      .from("subcategory")
      .insert(subcategories);
    if (subcategoryError) {
      console.error(
        `Error inserting subcategories for category ${category.name}:`,
        subcategoryError
      );
      continue;
    }
    console.log(
      `Subcategories for category ${category.name} created successfully`
    );
  }
};
