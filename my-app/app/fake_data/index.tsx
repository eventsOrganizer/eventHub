import { createAvailabilityData } from "./addAvailabilty";
import { createEvent } from "./createEvents";
import { createEventCategoriesAndSubcategories } from "./createEvetCategories";
import { injectMedia } from "./createImages";
import { injectLocations } from "./createLocation";
import { createDataForAllCategories } from "./createServices";
import { createSeviceCategory } from "./createServiceCategory";
import { fetchImages } from "./fetchImages";
import { createUserAssignments } from "./createServiceForUser";
import { createFakeComplaints } from "./createComplaints";
// createEventCategoriesAndSubcategories();
export const createFakeData = async () => {
// await createEventCategoriesAndSubcategories();
// await createSeviceCategory();
// await createDataForAllCategories();
//  await createEvent();
//   await createAvailabilityData();
//   await injectMedia();
//   await injectLocations();
// await createUserAssignments();
await createFakeComplaints();
};
createFakeData()
console.log("done creating fake data for the cocmplaint")
// console.log("images",fetchImages("nature", 10));
