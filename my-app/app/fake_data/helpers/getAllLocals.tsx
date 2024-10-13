import { supabase } from "../../services/supabaseClient";
export const getAllLocal = async () => {
  try {
    const { data, error } = await supabase.from("local").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching local data:", error);
    return [];
  }
};
