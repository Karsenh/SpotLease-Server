import { mongooseConnectUri } from '@Config/database.config';
import mongoose from 'mongoose';

import { UseCaseSchema } from '@Modules/spots/schemas/use-case.schema';
import { USE_CASES } from '@Constants/index';

// Function to seed amenities
export const seedUseCases = async () => {
  // Establish Mongoose connection
  await mongoose.connect(mongooseConnectUri, {
    dbName: process.env.DATABASE_NAME,
  });
  const useCaseModel = mongoose.model('UseCase', UseCaseSchema);

  // Loop through keys in object
  for (const key of Object.keys(USE_CASES)) {
    // Find existing use case with the same name
    const existingUseCase = await useCaseModel.findOne({ name: key });

    // Place space between words, use capital letter as separator.
    const formattedName = key.replace(/([a-z])([A-Z])/g, '$1 $2');

    if (!existingUseCase) {
      // If use case does not exist, create and save it
      const useCase = new useCaseModel({
        name: formattedName,
        nameKey: USE_CASES[key],
      });
      await useCase.save();
    }
  }

  // Close the Mongoose connection
  await mongoose.connection.close();
  console.log(`(i) Use cases has been seeded successfully.`);
};
