import { describe, it, expect, beforeEach } from 'vitest';
import { createCourse, listCourses, getCourseById, getCourseBySlug } from '../src/courses.js';
import { getPrismaClient } from '../src/database.js';
import { SDKException } from '../src/errors.js';
import type { CourseCreate } from '../src/schemas.js';

describe('Courses', () => {
  let testOwnerId: string;
  let prisma: any;

  beforeEach(async () => {
    prisma = getPrismaClient();
    
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com'
      }
    });
    testOwnerId = user.id;
  });

  describe('createCourse', () => {
    it('should create a course with lessons', async () => {
      const courseInput: CourseCreate = {
        ownerId: testOwnerId,
        title: 'Test Course',
        description: 'A test course',
        lessons: [
          { title: 'Lesson 1', content: 'Content 1' },
          { title: 'Lesson 2', content: 'Content 2', order: 1 }
        ]
      };

      const course = await createCourse(courseInput);

      expect(course).toBeDefined();
      expect(course.id).toBeTypeOf('string');
      expect(course.title).toBe('Test Course');
      expect(course.description).toBe('A test course');
      expect(course.ownerId).toBe(testOwnerId);
      expect(course.slug).toBe('test-course');
      expect(course.lessons).toHaveLength(2);
      expect(course.lessons?.[0].title).toBe('Lesson 1');
      expect(course.lessons?.[1].title).toBe('Lesson 2');
    });

    it('should generate slug from title', async () => {
      const courseInput: CourseCreate = {
        ownerId: testOwnerId,
        title: 'My Awesome Course!!! 123',
        lessons: [{ title: 'Lesson 1', content: 'Content 1' }]
      };

      const course = await createCourse(courseInput);
      expect(course.slug).toBe('my-awesome-course-123');
    });

    it('should validate required fields', async () => {
      const invalidInput = {
        ownerId: '',
        title: '',
        lessons: []
      } as CourseCreate;

      await expect(createCourse(invalidInput)).rejects.toThrow();
    });

    it('should require at least one lesson', async () => {
      const invalidInput: CourseCreate = {
        ownerId: testOwnerId,
        title: 'Test Course',
        lessons: []
      };

      await expect(createCourse(invalidInput)).rejects.toThrow();
    });
  });

  describe('listCourses', () => {
    it('should return courses for specified owner', async () => {
      // Create two courses for test owner
      await createCourse({
        ownerId: testOwnerId,
        title: 'Course 1',
        lessons: [{ title: 'Lesson 1', content: 'Content 1' }]
      });

      await createCourse({
        ownerId: testOwnerId,
        title: 'Course 2',
        lessons: [{ title: 'Lesson 1', content: 'Content 1' }]
      });

      // Create another user and course (should not be returned)
      const otherUser = await prisma.user.create({
        data: { email: 'other@example.com' }
      });

      await createCourse({
        ownerId: otherUser.id,
        title: 'Other Course',
        lessons: [{ title: 'Lesson 1', content: 'Content 1' }]
      });

      const courses = await listCourses(testOwnerId);

      expect(courses).toHaveLength(2);
      expect(courses.every(course => course.ownerId === testOwnerId)).toBe(true);
      expect(courses[0].title).toBe('Course 2'); // Most recent first
      expect(courses[1].title).toBe('Course 1');
    });

    it('should return empty array for owner with no courses', async () => {
      const courses = await listCourses(testOwnerId);
      expect(courses).toEqual([]);
    });

    it('should validate owner ID', async () => {
      await expect(listCourses('')).rejects.toThrow(SDKException);
      await expect(listCourses(null as any)).rejects.toThrow(SDKException);
    });
  });

  describe('getCourseById', () => {
    it('should return course by ID', async () => {
      const createdCourse = await createCourse({
        ownerId: testOwnerId,
        title: 'Test Course',
        lessons: [{ title: 'Lesson 1', content: 'Content 1' }]
      });

      const course = await getCourseById(createdCourse.id);

      expect(course).toBeDefined();
      expect(course!.id).toBe(createdCourse.id);
      expect(course!.title).toBe('Test Course');
    });

    it('should return null for non-existent course', async () => {
      const course = await getCourseById('non-existent-id');
      expect(course).toBeNull();
    });

    it('should validate course ID', async () => {
      await expect(getCourseById('')).rejects.toThrow(SDKException);
      await expect(getCourseById(null as any)).rejects.toThrow(SDKException);
    });
  });

  describe('getCourseBySlug', () => {
    it('should return course by slug', async () => {
      const createdCourse = await createCourse({
        ownerId: testOwnerId,
        title: 'Test Course',
        lessons: [{ title: 'Lesson 1', content: 'Content 1' }]
      });

      const course = await getCourseBySlug('test-course');

      expect(course).toBeDefined();
      expect(course!.slug).toBe('test-course');
      expect(course!.title).toBe('Test Course');
    });

    it('should return null for non-existent slug', async () => {
      const course = await getCourseBySlug('non-existent-slug');
      expect(course).toBeNull();
    });

    it('should validate slug', async () => {
      await expect(getCourseBySlug('')).rejects.toThrow(SDKException);
      await expect(getCourseBySlug(null as any)).rejects.toThrow(SDKException);
    });
  });
});
