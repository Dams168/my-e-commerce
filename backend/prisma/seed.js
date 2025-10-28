import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { categories, products } from './data.js';

async function main() {
  try {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    for (const category of categories) {
      await prisma.category.create({
        data: category,
      });
    }

    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
    }
    console.log(`Database has been seeded. 🌱`);
  } catch (error) {
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
