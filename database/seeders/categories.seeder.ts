import { mongooseConnectUri } from '@Config/database.config';
import mongoose from 'mongoose';

import { CategorySchema } from '@Modules/spots/schemas/category.schema';
import { CATEGORIES } from '@Constants/index';

// Function to seed amenities
export const seedCategories = async () => {
  // Establish Mongoose connection
  await mongoose.connect(mongooseConnectUri, {
    dbName: process.env.DATABASE_NAME,
  });
  const categoryModel = mongoose.model('Category', CategorySchema);

  // Loop through keys in object
  for (const key of Object.keys(CATEGORIES)) {
    // Find existing category with the same name
    const existingCategory = await categoryModel.findOne({ name: key });

    // Place space between words, use capital letter as separator.
    const formattedName = key.replace(/([a-z])([A-Z])/g, '$1 $2');

    if (!existingCategory) {
      // If category does not exist, create and save it
      const category = new categoryModel({
        name: formattedName,
        nameKey: CATEGORIES[key],
      });
      await category.save();
    }
  }

  // Close the Mongoose connection
  await mongoose.connection.close();
  console.log(`(i) Categories has been seeded successfully.`);
};
