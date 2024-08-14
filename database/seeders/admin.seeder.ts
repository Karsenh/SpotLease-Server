import { clerkClient } from '@clerk/clerk-sdk-node';
import { mongooseConnectUri } from '@Config/database.config';
import mongoose from 'mongoose';
import process from 'process';

import { UserSchema } from '@Modules/users/schemas/user.schema';

// Function to seed admin user
export const seedAdminUser = async () => {
  // Establish Mongoose connection
  await mongoose.connect(mongooseConnectUri, {
    dbName: process.env.DATABASE_NAME,
  });
  const userModel = mongoose.model('User', UserSchema);

  // Check if admin already exists
  const existingUser = await userModel.findOne({ roleId: 1 });

  // If admin does not exist, create clerk user, and admin user on platform save
  if (!existingUser) {
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: ['admin@spotlease.com'],
      password: 'Admin123!',
      firstName: 'Spotlease',
      lastName: 'Admin',
      skipPasswordChecks: true,
    });

    const adminUser = new userModel({
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      email: clerkUser.emailAddresses[0].emailAddress,
      roleId: 1,
      clerkUserId: clerkUser.id,
      accountStatus: 'ACTIVE',
    });
    await adminUser.save();
  }

  // Close the Mongoose connection
  await mongoose.connection.close();
  console.log(`(i) Admin user has been seeded successfully.`);
};
