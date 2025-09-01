import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('Database Integration Tests', () => {
  let prisma: PrismaClient;
  let testDbPath: string;

  beforeAll(async () => {
    // Create a unique test database file
    const testId = randomBytes(8).toString('hex');
    testDbPath = path.join(process.cwd(), `test-db-${testId}.db`);
    const databaseUrl = `file:${testDbPath}`;

    // Set up Prisma with test database
    process.env.DATABASE_URL = databaseUrl;

    // Push schema to test database (schema is in workspace root)
    const workspaceRoot = path.resolve(process.cwd(), '../..');
    execSync('pnpm prisma db push --force-reset', {
      cwd: workspaceRoot,
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: 'pipe',
    });

    // Initialize Prisma client
    prisma = new PrismaClient({
      datasources: {
        db: { url: databaseUrl },
      },
    });
  });

  afterAll(async () => {
    await prisma?.$disconnect();
    // Clean up test database file
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('User Operations', () => {
    it('should create and retrieve users', async () => {
      const userData = {
        email: 'test@example.com',
      };

      const user = await prisma.user.create({ data: userData });

      expect(user).toMatchObject(userData);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);

      const retrieved = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(retrieved).toMatchObject(userData);
    });

    it('should enforce unique email constraint', async () => {
      const userData = {
        email: 'duplicate@example.com',
      };

      await prisma.user.create({ data: userData });

      await expect(prisma.user.create({ data: userData })).rejects.toThrow();
    });
  });

  describe('Course Operations', () => {
    it('should create courses with proper relationships', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'creator@example.com',
        },
      });

      const courseData = {
        title: 'Test Course',
        description: 'A comprehensive test course',
        slug: 'test-course',
        ownerId: user.id,
      };

      const course = await prisma.course.create({
        data: courseData,
        include: { owner: true },
      });

      expect(course).toMatchObject({
        title: courseData.title,
        description: courseData.description,
        slug: courseData.slug,
      });
      expect(course.owner.email).toBe(user.email);
    });

    it('should handle foreign key constraints properly', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'owner@example.com',
        },
      });

      await prisma.course.create({
        data: {
          title: 'Test Course',
          description: 'Test Description',
          slug: 'test-course-fk',
          ownerId: user.id,
        },
      });

      // Trying to delete user with existing courses should fail due to foreign key constraint
      await expect(
        prisma.user.delete({ where: { id: user.id } })
      ).rejects.toThrow();

      // Must delete courses first, then user
      await prisma.course.deleteMany({ where: { ownerId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });

      // Verify user is deleted
      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(deletedUser).toBeNull();
    });
  });

  describe('Database Performance', () => {
    it('should handle large dataset operations efficiently', async () => {
      const users = Array.from({ length: 100 }, (_, i) => ({
        email: `user${i}@example.com`,
      }));

      const start = Date.now();
      await prisma.user.createMany({ data: users });
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second

      const count = await prisma.user.count();
      expect(count).toBe(100);
    });
  });
});
