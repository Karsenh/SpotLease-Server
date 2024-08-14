import { seedAmenities } from '@Database/seeders/amenities.seeder';
import { seedCategories } from '@Database/seeders/categories.seeder';
import { seedDisputeReasons } from '@Database/seeders/dispute-reasons.seeder';
import { seedReportReasons } from '@Database/seeders/report-reasons.seeder';
import { seedUseCases } from '@Database/seeders/use-cases.seeder';

const SEEDERS: object = {
  amenities: seedAmenities,
  categories: seedCategories,
  useCases: seedUseCases,
  disputeReasons: seedDisputeReasons,
  reportReasons: seedReportReasons,
  // admin: seedAdminUser,
};
async function seed(): Promise<void> {
  const [, , func] = process.argv;

  if (func && !SEEDERS[func]) {
    console.error('(!) Provided seeder was not found.');

    return;
  }
  if (func) {
    await SEEDERS[func]();
  } else {
    const seeders: (() => Promise<void>)[] = Object.values(SEEDERS);
    let seeder: () => Promise<void>;
    for (seeder of seeders) {
      await seeder();
    }
  }
}

seed().then(() => {
  console.log('(i) Execution successes.');
});
