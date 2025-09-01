import { describe, it, expect } from 'vitest';
import {
  createTestCourse,
  createTestUser,
  isValidId,
  isValidTimestamp,
} from '../src/utils';

describe('Cross-Package Integration Tests', () => {
  describe('Data consistency across packages', () => {
    it('should generate consistent test data formats', () => {
      const user = createTestUser('integration@test.com');
      const course = createTestCourse({ ownerId: user.id });

      // Verify data structure consistency
      expect(isValidId(user.id)).toBe(true);
      expect(isValidId(course.ownerId)).toBe(true);
      expect(isValidTimestamp(user.createdAt)).toBe(true);

      // Verify relationship integrity
      expect(course.ownerId).toBe(user.id);
      expect(user.email).toBe('integration@test.com');
    });

    it('should handle course creation workflow', () => {
      // Simulate typical course creation flow
      const owner = createTestUser('creator@launchkit.ai');
      const courseData = createTestCourse({
        ownerId: owner.id,
        title: 'AI Fundamentals',
        lessons: [
          { title: 'Introduction to AI', content: 'Basic concepts' },
          { title: 'Machine Learning', content: 'ML fundamentals' },
          { title: 'Neural Networks', content: 'Deep learning basics' },
        ],
      });

      // Verify the workflow produces valid data
      expect(courseData.ownerId).toBe(owner.id);
      expect(courseData.title).toBe('AI Fundamentals');
      expect(courseData.lessons).toHaveLength(3);
      expect(courseData.lessons[0].title).toBe('Introduction to AI');
    });

    it('should support bulk test data generation', () => {
      const users = Array.from({ length: 5 }, (_, i) =>
        createTestUser(`user${i}@test.com`)
      );

      const courses = users.map(user => createTestCourse({ ownerId: user.id }));

      // Verify bulk generation works correctly
      expect(users).toHaveLength(5);
      expect(courses).toHaveLength(5);

      // Verify all IDs are unique
      const userIds = users.map(u => u.id);
      const uniqueUserIds = [...new Set(userIds)];
      expect(uniqueUserIds).toHaveLength(5);

      // Verify relationships are maintained
      courses.forEach((course, index) => {
        expect(course.ownerId).toBe(users[index].id);
      });
    });
  });

  describe('Error simulation testing', () => {
    it('should provide helpers for testing validation errors', () => {
      // Simulate validation errors that might occur in SDK/API
      const invalidCourseData = createTestCourse({
        title: '', // Invalid empty title
        lessons: [], // Invalid empty lessons
      });

      expect(invalidCourseData.title).toBe('');
      expect(invalidCourseData.lessons).toHaveLength(0);
      expect(isValidId(invalidCourseData.ownerId)).toBe(true); // Owner ID should still be valid
    });

    it('should handle edge cases in test data', () => {
      // Test edge cases that might break the system
      const edgeCases = [
        createTestUser(''),
        createTestUser(
          'very-long-email-address@extremely-long-domain-name.com'
        ),
        createTestCourse({ title: 'A'.repeat(1000) }), // Very long title
        createTestCourse({
          lessons: Array.from({ length: 100 }, (_, i) => ({
            title: `Lesson ${i}`,
            content: `Content ${i}`,
          })),
        }), // Many lessons
      ];

      edgeCases.forEach(data => {
        expect(data).toBeDefined();
      });
    });
  });

  describe('Performance testing helpers', () => {
    it('should efficiently generate large datasets', () => {
      const startTime = Date.now();

      // Generate a reasonably large dataset
      const users = Array.from({ length: 100 }, (_, i) =>
        createTestUser(`perf${i}@test.com`)
      );
      const courses = Array.from({ length: 50 }, () => createTestCourse());

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (< 100ms for this dataset)
      expect(duration).toBeLessThan(100);
      expect(users).toHaveLength(100);
      expect(courses).toHaveLength(50);
    });
  });
});
