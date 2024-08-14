import { mongooseConnectUri } from '@Config/database.config';
import mongoose from 'mongoose';

import { ReportReasonSchema } from '@Modules/admin/schemas/report-reason.schema';
import { REPORT_REASONS } from '@Constants/index';

// Function to seed Report Reasons
export const seedReportReasons = async () => {
  // Establish Mongoose connection
  await mongoose.connect(mongooseConnectUri, {
    dbName: process.env.DATABASE_NAME,
  });
  const reportReasonModel = mongoose.model('ReportReason', ReportReasonSchema);

  // Loop through keys in REPORT_REASONS object
  for (const key of Object.keys(REPORT_REASONS)) {
    // Find existing reason with the same name
    const existingReason = await reportReasonModel.findOne({ name: key });

    // Place space between words, use capital letter as separator.
    const formattedName = key.replace(/([a-z])([A-Z])/g, '$1 $2');

    if (!existingReason) {
      // If reason does not exist, create and save it
      const reportReason = new reportReasonModel({
        name: formattedName,
        nameKey: REPORT_REASONS[key],
      });
      await reportReason.save();
    }
  }

  // Close the Mongoose connection
  await mongoose.connection.close();
  console.log(`(i) Report reasons has been seeded successfully.`);
};
