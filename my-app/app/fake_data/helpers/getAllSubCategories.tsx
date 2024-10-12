import { supabase } from "../../services/supabaseClient";

export const getSubcategoriesByCategory = async (categoryName: string) => {
  try {
    // First, get the category_id for the given category name
    const { data: categoryData, error: categoryError } = await supabase
      .from("category")
      .select("id")
      .eq("name", categoryName)
      .single();
console.log(categoryData);

    if (categoryError) throw categoryError;
    if (!categoryData) throw new Error(`Category "${categoryName}" not found`);

    const categoryId = categoryData.id;

    // Now, fetch subcategories using the category_id
    const { data: subcategories, error: subcategoryError } = await supabase
      .from("subcategory")
      .select("*")
      .eq("category_id", categoryId);
console.log("subcategories hhhhhhhhhhhhhhhhh",subcategories);
    if (subcategoryError) throw subcategoryError;
    return subcategories;
  } catch (error) {
    console.error(
      `Error fetching subcategories for category ${categoryName}:`,
      error
    );
    return [];
  }
};