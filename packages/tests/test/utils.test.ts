import { describe, it, expect } from 'vitest';
import {
  createTestUser,
  createTestCourse,
  createTestLesson,
  generateUniqueTestId,
  isTestEnvironment,
  getTestDatabaseUrl,
  isValidTimestamp,
  isValidId,
  hasValidationError,
} from '../src/utils';

describe('Test Utilities', () => {
  describe('createTestUser', () => {
    it('should create a test user with default email', () => {
      const user = createTestUser();

      expect(user.email).toBe('test@example.com');
      expect(user.id).toMatch(/^test-user-\d+-[a-f0-9]{8}$/);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should create a test user with custom email', () => {
      const customEmail = 'custom@test.com';
      const user = createTestUser(customEmail);

      expect(user.email).toBe(customEmail);
      expect(user.id).toMatch(/^test-user-\d+-[a-f0-9]{8}$/);
    });

    it('should create unique users on multiple calls', () => {
      const user1 = createTestUser();
      const user2 = createTestUser();

      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe('createTestCourse', () => {
    it('should create a course with default values', () => {
      const course = createTestCourse();

      expect(course.ownerId).toMatch(/^test-owner-\d+$/);
      expect(course.title).toMatch(/^Test Course [a-f0-9]{8}$/);
      expect(course.lessons).toHaveLength(2);
      expect(course.lessons[0].title).toBe('Introduction');
      expect(course.lessons[1].title).toBe('Advanced Topics');
    });

    it('should accept overrides', () => {
      const overrides = {
        ownerId: 'custom-owner',
        title: 'Custom Title',
      };
      const course = createTestCourse(overrides);

      expect(course.ownerId).toBe('custom-owner');
      expect(course.title).toBe('Custom Title');
      expect(course.lessons).toHaveLength(2); // Should still have default lessons
    });

    it('should create unique courses on multiple calls', async () => {
      const course1 = createTestCourse();
      // Small delay to ensure different timestamps
      await new Promise(resolve => globalThis.setTimeout(resolve, 1));
      const course2 = createTestCourse();

      expect(course1.title).not.toBe(course2.title);
      expect(course1.ownerId).not.toBe(course2.ownerId);
    });
  });

  describe('createTestLesson', () => {
    it('should create a lesson with default values', () => {
      const lesson = createTestLesson();

      expect(lesson.title).toBe('Test Lesson');
      expect(lesson.content).toBe('Test content');
    });

    it('should create a lesson with custom values', () => {
      const lesson = createTestLesson('Custom Title', 'Custom content');

      expect(lesson.title).toBe('Custom Title');
      expect(lesson.content).toBe('Custom content');
    });
  });

  describe('generateUniqueTestId', () => {
    it('should generate unique IDs with default prefix', () => {
      const id1 = generateUniqueTestId();
      const id2 = generateUniqueTestId();

      expect(id1).toMatch(/^test-\d+-[a-f0-9]{8}$/);
      expect(id2).toMatch(/^test-\d+-[a-f0-9]{8}$/);
      expect(id1).not.toBe(id2);
    });

    it('should generate unique IDs with custom prefix', () => {
      const id = generateUniqueTestId('custom');

      expect(id).toMatch(/^custom-\d+-[a-f0-9]{8}$/);
    });
  });

  describe('isTestEnvironment', () => {
    it('should return true in test environment', () => {
      // This test runs in test environment so should be true
      expect(isTestEnvironment()).toBe(true);
    });
  });

  describe('getTestDatabaseUrl', () => {
    it('should generate unique database URLs', () => {
      const url1 = getTestDatabaseUrl('api');
      const url2 = getTestDatabaseUrl('api');

      expect(url1).toMatch(/^file:\.\/db\/test-api-db-\d+-[a-f0-9]{8}\.db$/);
      expect(url2).toMatch(/^file:\.\/db\/test-api-db-\d+-[a-f0-9]{8}\.db$/);
      expect(url1).not.toBe(url2);
    });

    it('should include package name in URL', () => {
      const url = getTestDatabaseUrl('sdk');

      expect(url).toContain('test-sdk-');
    });
  });

  describe('validation helpers', () => {
    describe('isValidTimestamp', () => {
      it('should validate valid timestamps', () => {
        expect(isValidTimestamp(new Date())).toBe(true);
        expect(isValidTimestamp(Date.now())).toBe(true);
        expect(isValidTimestamp('2023-01-01T00:00:00Z')).toBe(true);
      });

      it('should reject invalid timestamps', () => {
        expect(isValidTimestamp(null)).toBe(false);
        expect(isValidTimestamp(undefined)).toBe(false);
        expect(isValidTimestamp('invalid')).toBe(false);
        expect(isValidTimestamp(0)).toBe(false);
      });
    });

    describe('isValidId', () => {
      it('should validate valid IDs', () => {
        expect(isValidId('test-123')).toBe(true);
        expect(isValidId('a')).toBe(true);
      });

      it('should reject invalid IDs', () => {
        expect(isValidId('')).toBe(false);
        expect(isValidId(null)).toBe(false);
        expect(isValidId(undefined)).toBe(false);
        expect(isValidId(123)).toBe(false);
      });
    });

    describe('hasValidationError', () => {
      it('should detect validation errors', () => {
        const error = new Error('Validation failed: title is required');

        expect(hasValidationError(error)).toBe(true);
        expect(hasValidationError(error, 'title')).toBe(true);
        expect(hasValidationError(error, 'email')).toBe(false);
      });

      it('should handle missing errors', () => {
        expect(hasValidationError(null)).toBe(false);
        expect(hasValidationError(undefined)).toBe(false);
        expect(hasValidationError({})).toBe(false);
      });
    });
  });
});
