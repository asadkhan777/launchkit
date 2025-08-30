import { beforeAll, beforeEach, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { disconnectPrisma } from '../src/database.js';

const TEST_DB_PATH = join(__dirname, 'test.db');

beforeAll(async () => {
  // Set test database URL
  process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;
  
  // Run Prisma migrations for test database
  try {
    execSync('pnpm prisma migrate deploy', {
      cwd: join(__dirname, '../../../'),
      stdio: 'pipe',
      env: { ...process.env, DATABASE_URL: `file:${TEST_DB_PATH}` }
    });
  } catch (error) {
    console.error('Failed to run migrations for test database:', error);
    throw error;
  }
});

beforeEach(async () => {
  // Clean test database before each test
  const { getPrismaClient } = await import('../src/database.js');
  const prisma = getPrismaClient();
  
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Disconnect and cleanup
  await disconnectPrisma();
  
  // Remove test database file
  if (existsSync(TEST_DB_PATH)) {
    try {
      unlinkSync(TEST_DB_PATH);
    } catch (error) {
      console.warn('Failed to cleanup test database:', error);
    }
  }
});
