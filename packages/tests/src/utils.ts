import { randomBytes } from 'crypto';

// Define types locally to avoid circular dependencies
export interface TestCourse {
  ownerId: string;
  title: string;
  lessons: TestLesson[];
}

export interface TestLesson {
  title: string;
  content: string;
}

// Test data factories for consistent test scenarios
export function createTestUser(email: string = 'test@example.com') {
  const timestamp = Date.now();
  const randomId = randomBytes(4).toString('hex');

  return {
    email,
    id: `test-user-${timestamp}-${randomId}`,
    createdAt: new Date(),
  };
}

export function createTestCourse(
  overrides: Partial<TestCourse> = {}
): TestCourse {
  const timestamp = Date.now();
  const randomId = randomBytes(4).toString('hex');

  return {
    ownerId: `test-owner-${timestamp}`,
    title: `Test Course ${randomId}`,
    lessons: [
      {
        title: 'Introduction',
        content: 'This is a test lesson content',
      },
      {
        title: 'Advanced Topics',
        content: 'This covers advanced concepts',
      },
    ],
    ...overrides,
  };
}

export function createTestLesson(
  title: string = 'Test Lesson',
  content: string = 'Test content'
): TestLesson {
  return {
    title,
    content,
  };
}

// Database test helpers
export function generateUniqueTestId(prefix: string = 'test'): string {
  const timestamp = Date.now();
  const randomId = randomBytes(4).toString('hex');
  return `${prefix}-${timestamp}-${randomId}`;
}

// Test environment helpers
export function isTestEnvironment(): boolean {
  return process.env.NODE_ENV === 'test';
}

export function getTestDatabaseUrl(packageName: string): string {
  const testId = generateUniqueTestId('db');
  return `file:./db/test-${packageName}-${testId}.db`;
}

// Validation helpers (return boolean for assertions)
export function isValidTimestamp(timestamp: any): boolean {
  if (!timestamp) return false;
  const date = new Date(timestamp);
  return date instanceof Date && !isNaN(date.getTime()) && date.getTime() > 0;
}

export function isValidId(id: any): boolean {
  return typeof id === 'string' && id.length > 0;
}

export function hasValidationError(
  error: any,
  expectedField?: string
): boolean {
  if (!error || !error.message) return false;
  if (!expectedField) return true;
  return error.message.toLowerCase().includes(expectedField.toLowerCase());
}
