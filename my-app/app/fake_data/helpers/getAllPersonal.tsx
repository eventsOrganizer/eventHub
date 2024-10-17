import { supabase } from "../../services/supabaseClient";

export const getAllPersonal = async () => {
  try {
    const { data, error } = await supabase.from("personal").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching personal data:", error);
    return [];
  }
};
