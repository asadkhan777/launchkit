import { beforeAll, afterAll, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, unlinkSync, mkdirSync } from 'fs';

// Create unique test database path for API tests
const dbDir = join(__dirname, '..', 'db');
const TEST_DB_PATH = join(dbDir, `test-api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.db`);

beforeAll(async () => {
  // Ensure db directory exists
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  // Set test database URL
  process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;
  
  // Remove existing test database if it exists
  if (existsSync(TEST_DB_PATH)) {
    try {
      unlinkSync(TEST_DB_PATH);
    } catch (error) {
      console.warn('Could not remove existing test database:', error);
    }
  }
  
  // Push schema to test database (creates tables without migrations)
  try {
    execSync('pnpm prisma db push --force-reset', {
      cwd: join(__dirname, '../../'),
      stdio: 'pipe',
      env: { ...process.env, DATABASE_URL: `file:${TEST_DB_PATH}` }
    });
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
});

beforeEach(async () => {
  // Clean test database before each test by importing the database client
  try {
    const { getPrismaClient } = await import('@launchkit-ai/sdk');
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
    const { disconnectPrisma } = await import('@launchkit-ai/sdk');
    await disconnectPrisma();
    // Wait for disconnection to complete
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.warn('Failed to disconnect Prisma:', error);
  }
  
  // Remove test database file
  if (existsSync(TEST_DB_PATH)) {
    try {
      unlinkSync(TEST_DB_PATH);
    } catch (error) {
      console.warn('Failed to cleanup test database:', error);
    }
  }
});
