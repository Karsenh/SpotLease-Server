import { BadRequestException } from '@nestjs/common';
import dayjs from 'dayjs';

import { USE_CASES } from '@Constants/index';

export const getRandomUseCaseArr = () => {
  const options = Object.values(USE_CASES);
  const randomCount = Math.floor(Math.random() * options.length) + 1;

  const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

  return shuffledOptions.slice(0, randomCount);
};

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

// Find one or create a model with name and keyName structure
export const findOrCreateItem = async (model, item) => {
  const normalizeKey = (name) =>
    name
      .trim()
      .replace(/[\W_]+/g, '-')
      .toLowerCase();

  let existingItem = await model.findOne({ nameKey: item.nameKey }).exec();

  if (!existingItem) {
    const generatedKey = normalizeKey(item.name);

    existingItem = await model.findOne({ nameKey: generatedKey }).exec();

    if (!existingItem) {
      existingItem = new model({
        name: item.name,
        nameKey: generatedKey,
      });
      await existingItem.save();
    }
  }

  return existingItem;
};

// Check date differences in days
export const dateDifferenceInDays = async (startDate: Date, endDate: Date) => {
  if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid()) {
    throw new BadRequestException('Invalid date format');
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (start.isAfter(end)) {
    throw new BadRequestException('Start date must not be after end date');
  }

  return end.diff(start, 'day');
};

// Remove underline from id's
export const renameKeys = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        renameKeys(obj[key]);
      }
      if (key === '_id') {
        obj['id'] = obj[key];
        delete obj[key];
      }
    }
  }
};

export const checkDatesOrder = (startDate, endDate) => {
  const startToDate = dayjs(startDate);
  const endDateToDate = dayjs(endDate);

  if (startToDate.isAfter(endDateToDate)) {
    throw new BadRequestException('Start date should be before end date');
  }

  return startToDate.diff(endDateToDate);
};
