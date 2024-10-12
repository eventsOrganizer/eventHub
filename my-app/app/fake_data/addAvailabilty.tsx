import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";

import { getAllPersonal } from "./helpers/getAllPersonal";
import { getAllEvents } from "./helpers/getAllEvents";
import { getAllLocal } from "./helpers/getAllLocals";

// Define types for the data structures
interface Personal {
  id: string; // Assuming 'id' is a string
}

interface Event {
  id: string; // Assuming 'id' is a string
}

interface Local {
  id: string; // Assuming 'id' is a string
}

interface Availability {
  personal_id: string | null;
  event_id: string | null;
  local_id: string | null;
  start: string; // Time in HH:mm format
  end: string; // Time in HH:mm format
  daysofweek: string; // Day of the week
  date: string; // Date in YYYY-MM-DD format
}

export const createAvailabilityData = async () => {
  try {
    // Fetch all data
    const personalData: Personal[] = await getAllPersonal();
    const eventData: any[] = await getAllEvents();
    const localData: any[] = await getAllLocal();

    // Prepare availability data
    const availabilityData: Availability[] = [];

    // Function to generate multiple availability entries
    const generateAvailabilityEntries = (
      id: string | null,
      type: "personal" | "event" | "local",
      count: number
    ) => {
      for (let i = 0; i < count; i++) {
        const startHour = faker.number.int({ min: 0, max: 23 });
        const endHour = startHour + faker.number.int({ min: 1, max: 5 }); // Ensure end hour is after start hour

        availabilityData.push({
          personal_id: type === "personal" ? id : null,
          event_id: type === "event" ? id : null,
          local_id: type === "local" ? id : null,
          start: `${startHour.toString().padStart(2, "0")}:00`, // Format start time
          end: `${endHour.toString().padStart(2, "0")}:00`, // Format end time
          daysofweek: faker.helpers.arrayElement([
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ]), // Random day of the week
          date: faker.date.future().toISOString().split("T")[0], // Random future date
        });
      }
    };

    // Create multiple availability entries for personal
    personalData.forEach((personal) => {
      generateAvailabilityEntries(personal.id, "personal", 3); // Create 3 availability entries for each personal
    });

    // Create multiple availability entries for events
    eventData.forEach((event) => {
      generateAvailabilityEntries(event.id, "event", 3); // Create 3 availability entries for each event
    });

    // Create multiple availability entries for local
    localData.forEach((local) => {
      generateAvailabilityEntries(local.id, "local", 3); // Create 3 availability entries for each local
    });

    // Insert availability data into the database
    const { error } = await supabase
      .from("availability")
      .insert(availabilityData);
    if (error) {
      console.error("Error inserting availability data:", error);
      return;
    }

    console.log("Availability data created successfully");
  } catch (error) {
    console.error("Error creating availability data:", error);
  }
};

// Call the function to create availability data
