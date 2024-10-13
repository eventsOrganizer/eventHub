import { supabase } from "../services/supabaseClient";
import { getAllLocal } from "./helpers/getAllLocals";
import { getAllUsers } from "./helpers/geAllUsers";
import { getAllEvents } from "./helpers/getAllEvents";
import { faker } from "@faker-js/faker";

// ... (keep the existing interface definitions)

export const injectLocations = async () => {
  try {
    const [locals, users, events] = await Promise.all([
      getAllLocal(),
      getAllUsers(),
      getAllEvents(),
    ]);

    const locations = [];

    for (const user of users) {
      locations.push({
        longitude: faker.location.longitude(),
        latitude: faker.location.latitude(),
        user_id: user.id,
      });
    }

    for (const local of locals) {
      locations.push({
        longitude: faker.location.longitude(),
        latitude: faker.location.latitude(),
        local_id: local.id,
      });
    }

    for (const event of events) {
      locations.push({
        longitude: faker.location.longitude(),
        latitude: faker.location.latitude(),
        event_id: event.id,
      });
    }

    // Insert locations into Supabase
    const { data, error } = await supabase
      .from("location")
      .insert(locations)
      .select();

    if (error) {
      throw error;
    }

    console.log("Locations inserted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error injecting locations:", error);
    return [];
  }
};