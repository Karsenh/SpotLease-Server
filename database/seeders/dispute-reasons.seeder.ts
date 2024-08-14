import { mongooseConnectUri } from '@Config/database.config';
import mongoose from 'mongoose';

import { DisputeReasonSchema } from '@Modules/offers/schemas/dispute-reason.schem';
import { DISPUTE_REASONS } from '@Constants/index';

// Function to seed Dispute Reasons
export const seedDisputeReasons = async () => {
  // Establish Mongoose connection
  await mongoose.connect(mongooseConnectUri, {
    dbName: process.env.DATABASE_NAME,
  });
  const disputeReasonModel = mongoose.model(
    'DisputeReason',
    DisputeReasonSchema,
  );

  // Loop through keys in DISPUTE_REASONS object
  for (const key of Object.keys(DISPUTE_REASONS)) {
    // Find existing reason with the same name
    const existingReason = await disputeReasonModel.findOne({ name: key });

    // Place space between words, use capital letter as separator.
    const formattedName = key.replace(/([a-z])([A-Z])/g, '$1 $2');

    if (!existingReason) {
      // If reason does not exist, create and save it
      const disputeReason = new disputeReasonModel({
        name: formattedName,
        nameKey: DISPUTE_REASONS[key],
      });
      await disputeReason.save();
    }
  }

  // Close the Mongoose connection
  await mongoose.connection.close();
  console.log(`(i) Dispute reasons has been seeded successfully.`);
};
