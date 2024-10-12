import { supabase } from "../../services/supabaseClient";

export const getAllEvents = async () => {
  try {
    const { data, error } = await supabase.from("event").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching event data:", error);
    return [];
  }
};
