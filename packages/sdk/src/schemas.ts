import { z } from 'zod';

// Lesson schema
export const LessonCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  order: z.number().int().min(0).optional(),
});

export const LessonSchema = LessonCreateSchema.extend({
  id: z.string(),
  courseId: z.string(),
  order: z.number().int().min(0), // Not optional in the full schema
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Course schema
export const CourseCreateSchema = z.object({
  ownerId: z.string().min(1, 'Owner ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  lessons: z.array(LessonCreateSchema).min(1, 'At least one lesson is required'),
});

export const CourseSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lessons: z.array(LessonSchema).optional(),
});

// User schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
});

// Error schemas
export const SDKErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

// Export types
export type LessonCreate = z.infer<typeof LessonCreateSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type CourseCreate = z.infer<typeof CourseCreateSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type User = z.infer<typeof UserSchema>;
export type SDKError = z.infer<typeof SDKErrorSchema>;
