import '../setup.ts';
import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createApp } from '@/index.js';

describe('API Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    try {
      app = await createApp();
      await app.ready();
    } catch (error) {
      console.error('Failed to create app:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /healthz', () => {
    it('should return health status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/healthz',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
      expect(body.checks).toBeDefined();
      expect(body.checks.database).toBe('ok');
    });
  });

  describe('POST /courses', () => {
    it('should create a course with valid input', async () => {
      // First create a user for the course
      const { getPrismaClient } = await import('@launchkit-ai/sdk');
      const prisma = getPrismaClient();
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
        },
      });

      const courseData = {
        ownerId: user.id,
        title: 'Test Course',
        description: 'A test course for integration testing',
        lessons: [
          {
            title: 'Lesson 1',
            content: 'Content for lesson 1',
            order: 1,
          },
          {
            title: 'Lesson 2',
            content: 'Content for lesson 2',
            order: 2,
          },
        ],
      };

      const response = await app.inject({
        method: 'POST',
        url: '/courses',
        payload: courseData,
      });

      expect(response.statusCode).toBe(201);
      const course = JSON.parse(response.payload);
      expect(course).toHaveProperty('id');
      expect(course.title).toBe(courseData.title);
      expect(course.description).toBe(courseData.description);
      expect(course.lessons).toHaveLength(2);
    });

    it('should return 400 for invalid input', async () => {
      const invalidData = {
        // Missing required fields
        title: 'Test Course',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/courses',
        payload: invalidData,
      });

      expect(response.statusCode).toBe(400);
      const error = JSON.parse(response.payload);
      expect(error).toHaveProperty('error', 'Validation failed');
      expect(error).toHaveProperty('details');
    });

    it('should return 400 for missing title', async () => {
      // This test doesn't need a real user since it's testing validation failure
      const invalidData = {
        ownerId: 'non-existent-user-id',
        description: 'A course without a title',
        lessons: [],
      };

      const response = await app.inject({
        method: 'POST',
        url: '/courses',
        payload: invalidData,
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /courses', () => {
    it('should list courses for a user', async () => {
      // First create a user for the course
      const { getPrismaClient } = await import('@launchkit-ai/sdk');
      const prisma = getPrismaClient();
      const user = await prisma.user.create({
        data: {
          email: 'test-list@example.com',
        },
      });

      const ownerId = user.id;

      // First create a course
      const courseData = {
        ownerId,
        title: 'Listed Course',
        description: 'A course to be listed',
        lessons: [
          {
            title: 'Single Lesson',
            content: 'Content for the lesson',
          },
        ],
      };

      await app.inject({
        method: 'POST',
        url: '/courses',
        payload: courseData,
      });

      // Then list courses
      const response = await app.inject({
        method: 'GET',
        url: `/courses?ownerId=${ownerId}`,
      });

      expect(response.statusCode).toBe(200);
      const courses = JSON.parse(response.payload);
      expect(Array.isArray(courses)).toBe(true);
      expect(courses.length).toBeGreaterThan(0);
      expect(courses[0].title).toBe(courseData.title);
    });

    it('should return 400 for missing ownerId query parameter', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/courses',
      });

      expect(response.statusCode).toBe(400);
      const error = JSON.parse(response.payload);
      expect(error).toHaveProperty('error', 'Invalid query parameters');
    });

    it('should return empty array for user with no courses', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/courses?ownerId=user-with-no-courses',
      });

      expect(response.statusCode).toBe(200);
      const courses = JSON.parse(response.payload);
      expect(Array.isArray(courses)).toBe(true);
      expect(courses).toHaveLength(0);
    });
  });

  describe('Integration flow', () => {
    it('should create course and then retrieve it', async () => {
      // First create a user for the integration test
      const { getPrismaClient } = await import('@launchkit-ai/sdk');
      const prisma = getPrismaClient();
      const user = await prisma.user.create({
        data: {
          email: 'integration-test@example.com',
        },
      });

      const courseData = {
        ownerId: user.id,
        title: 'Integration Test Course',
        description: 'A course for testing the full flow',
        lessons: [
          {
            title: 'First Lesson',
            content: 'Content for first lesson',
            order: 1,
          },
        ],
      };

      // Create course
      const createResponse = await app.inject({
        method: 'POST',
        url: '/courses',
        payload: courseData,
      });

      expect(createResponse.statusCode).toBe(201);
      const createdCourse = JSON.parse(createResponse.payload);

      // Retrieve courses
      const listResponse = await app.inject({
        method: 'GET',
        url: `/courses?ownerId=${user.id}`,
      });

      expect(listResponse.statusCode).toBe(200);
      const courses = JSON.parse(listResponse.payload);
      expect(courses).toHaveLength(1);
      expect(courses[0].id).toBe(createdCourse.id);
      expect(courses[0].title).toBe(courseData.title);
    });
  });
});
