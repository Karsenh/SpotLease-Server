import { mongooseConnectUri } from '@Config/database.config';
import mongoose from 'mongoose';

import { AmenitySchema } from '@Modules/spots/schemas/amenity.schema';
import { AMENITIES } from '@Constants/index';

// Function to seed amenities
export const seedAmenities = async () => {
  // Establish Mongoose connection
  await mongoose.connect(mongooseConnectUri, {
    dbName: process.env.DATABASE_NAME,
  });
  const amenityModel = mongoose.model('Amenity', AmenitySchema);

  // Loop through keys in AMENITIES object
  for (const key of Object.keys(AMENITIES)) {
    // Find existing amenity with the same name
    const existingAmenity = await amenityModel.findOne({ name: key });

    // Place space between words, use capital letter as separator.
    const formattedName = key.replace(/([a-z])([A-Z])/g, '$1 $2');

    if (!existingAmenity) {
      // If amenity does not exist, create and save it
      const amenity = new amenityModel({
        name: formattedName,
        nameKey: AMENITIES[key],
      });
      await amenity.save();
    }
  }

  // Close the Mongoose connection
  await mongoose.connection.close();
  console.log(`(i) Amenities has been seeded successfully.`);
};
