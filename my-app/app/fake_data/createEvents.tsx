import { faker } from "@faker-js/faker";
import { supabase } from "../services/supabaseClient";
import { getAllUsers } from "./helpers/geAllUsers";
import { getSubcategoriesByCategory } from "./helpers/getAllSubCategories";

// ... existing code ...

export const createEvent = async () => {
  // Define event categories
  const eventCategories = [
    "Art and Culture Events",
    "Food and Beverage Events",
    "Technology and Innovation Events",
    "Health and Wellness Events",
    "Educational Events",
    "Charity and Fundraising Events",
    "Religious and Spiritual Events",
  ];

  // Insert categories and their subcategories into the database
  for (const categoryName of eventCategories) {
    // Insert category
   

    // Fetch subcategories for the current category
    const subcategories = await getSubcategoriesByCategory(categoryName);

    // Fetch all users to assign to events
    const users = await getAllUsers();
    const userIds = users.map((user: any) => user.id);

    // Prepare events for each subcategory
    const events = subcategories.map((sub: any) => ({
      type: faker.helpers.arrayElement(["online", "outdoor", "indoor"]), // Randomly select event type
      privacy: faker.datatype.boolean(), // Randomly set privacy
      user_id: faker.helpers.arrayElement(userIds), // Randomly assign a user
      details: faker.lorem.sentence(), // Generate a random sentence for the details
      subcategory_id: sub.id,
      name: `${sub.name} Event`, // Use the subcategory name for the event name
    }));

    // Insert events into the database
    const { error: eventError } = await supabase.from("event").insert(events);
    if (eventError) {
      console.error(
        `Error inserting events for category ${categoryName}:`,
        eventError
      );
      continue;
    }
    console.log(`Events for category ${categoryName} created successfully`);
  }
};

// Call the function to create event categories, subcategories, and events

