import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";

import { getAllLocal } from "./helpers/getAllLocals";
import { getAllUsers } from "./helpers/geAllUsers";
import { getAllEvents } from "./helpers/getAllEvents";
import { getAllPersonal } from "./helpers/getAllPersonal";
import { getAllMaterials } from "./helpers/getAllMaterials";

// Type definitions
interface Media {
  id?: number; // Optional for new entries
  event_id: number;
  user_id: string; // Assuming UUID is a string
  personal_id: number;
  material_id: number;
  local_id: number;
  url: string; // URL of the media
}

// Function to inject fake media and insert into Supabase
export const injectMedia = async () => {
  try {
    // Fetch data concurrently
    const [locals, users, events, personal, materials] = await Promise.all([
      getAllLocal(),
      getAllUsers(),
      getAllEvents(),
      getAllPersonal(),
      getAllMaterials(),
    ]);

    const mediaEntries: any[] = [];
    for (const user of users) {
      mediaEntries.push({
        //@ts-ignore
        user_id: user.id,
        //@ts-ignore
        url: faker.image.urlPicsumPhotos({ width: 128 }), // Example URL
      });

    }
    for (const event of events) {
      mediaEntries.push({
        //@ts-ignore
        event_id: event.id,
        //@ts-ignore
        url: faker.image.urlPicsumPhotos({ width: 128 }), // Example URL
      });
    }
    for (const local of locals) {
      mediaEntries.push({     
        //@ts-ignore
        local_id: local.id,
        //@ts-ignore
        url: faker.image.urlPicsumPhotos({ width: 128 }), // Example URL
      });
    }
    for (const personalEntry of personal) {
      mediaEntries.push({
        //@ts-ignore  
        personal_id: personalEntry.id,
        //@ts-ignore
        url: faker.image.urlPicsumPhotos({ width: 128 }), // Example URL
      });
    }
    for (const material of materials) {
      mediaEntries.push({
        //@ts-ignore
        material_id: material.id, 
        //@ts-ignore
        url: faker.image.urlPicsumPhotos({ width: 128 }), // Example URL
      });
    }



    // Insert media entries into Supabase
    const { data: insertedMedia, error: insertError } = await supabase
      .from("media")
      .insert(mediaEntries);

    if (insertError) {
      throw insertError;
    }

    console.log("Inserted media entries:", insertedMedia);
    return insertedMedia; // Return the inserted media entries
  } catch (error) {
    console.error("Error injecting media:", error);
    return [];
  }
};
