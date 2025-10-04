import client from '../utils/redis.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAllCategories = async () => {
  // get data from cache
  const cacheKey = 'categories:all';
  const cache = await client.get(cacheKey);
  if (cache) {
    console.log('get data from cache');
    return JSON.parse(cache);
  }
  // if not exist in cache, get data from database
  const parentCategory = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    select: {
      id: true,
      name: true,
      children: true,
    },
  });
  // save to cache
  await client.set(cacheKey, JSON.stringify(parentCategory), { EX: 3600 });
  console.log('get data from database');

  return parentCategory;
};

export default {
  getAllCategories,
};
