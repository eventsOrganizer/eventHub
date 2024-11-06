import { supabase } from "../../services/supabaseClient";

const categories = {
  service: [
    {
      name: "Crew",
      subcategories: ["Cleaning", "Security", "Cooker", "Waiter", "Music team leader"]
    },
    {
      name: "Local",
      subcategories: ["Mansion", "Hotel", "Restaurant"]
    },
    {
      name: "Material",
      subcategories: ["Audio Visual", "Furniture", "Plates", "Bar Equipment", "Cleaning Equipment", "Decoration", "Tableware", "Cutlery", "Glassware"]
    }
  ],
  event: [
    {
      name: "Sports",
      subcategories: ["Tennis", "Football", "Swimming", "Darts"]
    },
    {
      name: "Clubbing",
      subcategories: ["Techno", "Hip-Hop", "Jazz", "Rock"]
    },
    {
      name: "Science",
      subcategories: ["Physics", "Chemistry", "Biology", "Astronomy"]
    },
    {
      name: "Technology",
      subcategories: ["AI", "Blockchain", "IoT", "Robotics"]
    },
    {
      name: "Politics",
      subcategories: ["Debate", "Election", "Policy", "International Relations"]
    }
  ]
};

export const generateCategories = async () => {
  try {
    for (const type in categories) {
      for (const category of categories[type as keyof typeof categories]) {
        // Insérer la catégorie
        const { data: categoryData, error: categoryError } = await supabase
          .from('category')
          .insert({ name: category.name, type })
          .select()
          .single();

        if (categoryError) throw categoryError;

        // Insérer les sous-catégories
        const subcategoriesData = category.subcategories.map(name => ({
          name,
          category_id: categoryData.id
        }));

        const { error: subError } = await supabase
          .from('subcategory')
          .insert(subcategoriesData);

        if (subError) throw subError;
      }
    }
    console.log('✅ Catégories générées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des catégories:', error);
  }
};