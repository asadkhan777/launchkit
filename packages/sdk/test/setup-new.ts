import { beforeEach, afterAll } from 'vitest';
import { disconnectPrisma } from '../src/database.js';

beforeEach(async () => {
  // Clean test database before each test
  try {
    const { getPrismaClient } = await import('../src/database.js');
    const prisma = getPrismaClient();
    
    await prisma.lesson.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.warn('Failed to clean database in beforeEach:', error);
  }
});

afterAll(async () => {
  // Disconnect and cleanup
  try {
    await disconnectPrisma();
    // Wait for disconnection to complete
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.warn('Failed to disconnect Prisma:', error);
  }
});
