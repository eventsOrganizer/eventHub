import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";

export const createEventCategoriesAndSubcategories = async () => {
  // Define event categories and their subcategories
  const eventCategories = [
    {
      name: "Art and Culture Events",
      subcategories: [
        "Art Exhibitions",
        "Gallery Openings",
        "Solo Exhibitions",
        "Group Exhibitions",
        "Virtual Art Shows",
        "Art Auctions",
        "Theater Performances",
        "Musicals",
        "Plays",
        "Opera",
        "Dance Recitals",
        "Children's Theater",
        "Film Festivals",
        "Independent Film Showcases",
        "Short Film Competitions",
        "Documentaries",
        "Animation Festivals",
        "Genre-Specific Festivals (Horror, Sci-Fi, etc.)",
        "Cultural Festivals",
        "Heritage Celebrations",
        "Cultural Parades",
        "Ethnic Food Festivals",
        "Traditional Music Festivals",
        "Craft Fairs",
      ],
    },
    {
      name: "Food and Beverage Events",
      subcategories: [
        "Wine and Beer Tastings",
        "Wine Festivals",
        "Craft Beer Tastings",
        "Brewery Tours",
        "Food and Wine Pairing Events",
        "Winemaker Dinners",
        "Cooking Classes",
        "Specialty Cooking Classes (Italian, French, etc.)",
        "Baking Workshops",
        "Healthy Cooking Classes",
        "Kids Cooking Classes",
        "Culinary Competitions",
        "Food Festivals",
        "Street Food Festivals",
        "BBQ Competitions",
        "Dessert Festivals",
        "Local Farmer's Markets",
        "Culinary Showcases",
      ],
    },
    {
      name: "Technology and Innovation Events",
      subcategories: [
        "Tech Conferences",
        "Developer Conferences",
        "Startup Expos",
        "Innovation Summits",
        "Tech Talks",
        "Hackathons",
        "Workshops and Seminars",
        "Coding Bootcamps",
        "Digital Marketing Workshops",
        "Data Science Seminars",
        "AI and Machine Learning Workshops",
        "Cybersecurity Training",
        "Product Launches",
        "Tech Gadgets",
        "Software Releases",
        "App Launch Events",
        "Hardware Demonstrations",
        "E-commerce Launches",
      ],
    },
    {
      name: "Health and Wellness Events",
      subcategories: [
        "Fitness Classes",
        "Yoga Retreats",
        "Pilates Workshops",
        "Boot Camp Classes",
        "Zumba Events",
        "Martial Arts Classes",
        "Health Fairs",
        "Community Health Screenings",
        "Wellness Expos",
        "Nutrition Workshops",
        "Mental Health Awareness Events",
        "Holistic Health Fairs",
        "Retreats and Getaways",
        "Wellness Retreats",
        "Meditation Retreats",
        "Spa Getaways",
        "Nature Retreats",
        "Adventure Retreats",
      ],
    },
    {
      name: "Educational Events",
      subcategories: [
        "Workshops and Training",
        "Professional Development Workshops",
        "Skill Enhancement Training",
        "Certification Courses",
        "Educational Fairs",
        "School Open Houses",
        "Guest Lectures and Talks",
        "University Speaker Series",
        "Community Talks",
        "Author Readings",
        "Science and Technology Talks",
        "Career Development Sessions",
        "Field Trips and Outdoor Learning",
        "Nature Walks",
        "Museum Tours",
        "Historical Site Visits",
        "Educational Camps",
        "Environmental Education Events",
      ],
    },
    {
      name: "Charity and Fundraising Events",
      subcategories: [
        "Charity Galas",
        "Formal Dinners",
        "Silent Auctions",
        "Benefit Concerts",
        "Fashion Shows",
        "Themed Parties",
        "Community Fundraisers",
        "Fun Runs and Walks",
        "Bake Sales",
        "Raffle Events",
        "Car Wash Fundraisers",
        "Volunteer Days",
        "Online Fundraising Events",
        "Crowdfunding Campaigns",
        "Virtual Auctions",
        "Live-stream Fundraising Events",
        "Online Benefit Concerts",
        "Social Media Challenges",
      ],
    },
    {
      name: "Religious and Spiritual Events",
      subcategories: [
        "Religious Services",
        "Worship Services",
        "Holiday Celebrations",
        "Community Prayers",
        "Ceremonies and Rituals",
        "Spiritual Retreats",
        "Workshops and Classes",
        "Bible Study Groups",
        "Meditation and Mindfulness Classes",
        "Spiritual Development Workshops",
        "Interfaith Dialogues",
        "Faith-Based Support Groups",
        "Community Gatherings",
        "Potluck Dinners",
        "Faith-Based Festivals",
        "Service Projects",
        "Community Outreach Events",
        "Religious Conferences",
      ],
    },
  ];

  // Insert categories and their subcategories into the database
  for (const category of eventCategories) {
    // Insert category
    const { data: categoryData, error: categoryError } = await supabase
      .from("category")
      .insert([{ name: category.name, type: "event" }])
      .select();

    if (categoryError) {
      console.error(
        `Error inserting category ${category.name}:`,
        categoryError
      );
      continue;
    }

    const categoryId = categoryData[0].id; // Get the inserted category ID

    // Prepare subcategories for insertion
    const subcategories = category.subcategories.map((sub) => ({
      name: sub,
      category_id: categoryId,
    }));

    // Insert subcategories
    const { error: subcategoryError } = await supabase
      .from("subcategory")
      .insert(subcategories);
    if (subcategoryError) {
      console.error(
        `Error inserting subcategories for category ${category.name}:`,
        subcategoryError
      );
      continue;
    }
    console.log(
      `Subcategories for category ${category.name} created successfully`
    );
  }
};
