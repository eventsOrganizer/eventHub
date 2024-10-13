import { supabase } from "../../services/supabaseClient";
export const getAllMaterials = async () => {
  try {
    const { data, error } = await supabase.from("material").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching material data:", error);
    return [];
  }
};
