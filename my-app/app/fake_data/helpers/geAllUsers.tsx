import { supabase } from "../../services/supabaseClient"; 

export const getAllUsers = async () => {
  try {
    const { data: users, error } = await supabase.from("user").select("*");
    if (error) throw error;
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
