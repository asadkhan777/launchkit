import { beforeAll, beforeEach, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { existsSync, unlinkSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { disconnectPrisma } from '../src/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create unique test database path for SDK tests
const dbDir = join(__dirname, '..', 'db');
const TEST_DB_PATH = join(dbDir, `test-sdk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.db`);

beforeAll(async () => {
  // Ensure any existing connections are closed
  await disconnectPrisma();
  
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
      // If file is locked, try to force close connections and retry
      console.warn('Database file locked, attempting to force cleanup...');
      await disconnectPrisma();
      // Wait a bit for connections to close
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
        unlinkSync(TEST_DB_PATH);
      } catch (retryError) {
        console.warn('Could not remove locked database file, continuing...');
      }
    }
  }
  
  // Push schema to test database (creates tables without migrations)
  try {
    const rootDir = join(__dirname, '../../../');
    console.log('Setting up SDK test database...');
    console.log('Working directory:', rootDir);
    console.log('Database URL:', `file:${TEST_DB_PATH}`);
    
    execSync('pnpm prisma db push --force-reset', {
      cwd: rootDir,
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: `file:${TEST_DB_PATH}` }
    });
    
    console.log('SDK test database setup complete');
  } catch (error) {
    console.error('Failed to setup test database:', error);
    console.error('Command working directory:', join(__dirname, '../../../'));
    console.error('Database URL:', `file:${TEST_DB_PATH}`);
    throw error;
  }
});

beforeEach(async () => {
  // Clean test database before each test
  const { getPrismaClient } = await import('../src/database.js');
  const prisma = getPrismaClient();
  
  try {
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
  
  // Remove test database file
  if (existsSync(TEST_DB_PATH)) {
    try {
      unlinkSync(TEST_DB_PATH);
    } catch (error) {
      console.warn('Failed to cleanup test database:', error);
    }
  }
});
