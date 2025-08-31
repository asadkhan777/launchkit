import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('LaunchKit AI - Happy Path Flow', () => {
  test('should complete the course creation and landing page flow', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Check basic page load and accessibility
    await expect(page).toHaveTitle(/LaunchKit/i);
    await injectAxe(page);
    await checkA11y(page);
    
    // Verify key elements are present on landing page
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('body')).toContainText('LaunchKit');
    
    // Test API health endpoint integration
    const response = await page.request.get('http://localhost:4000/healthz');
    expect(response.status()).toBe(200);
    
    const healthData = await response.json();
    expect(healthData).toHaveProperty('status', 'healthy');
    expect(healthData).toHaveProperty('timestamp');
    expect(healthData).toHaveProperty('checks');
    
    // Verify database connectivity through health endpoint
    expect(healthData.checks).toHaveProperty('database', 'healthy');
  });

  test('should handle API course operations', async ({ page }) => {
    // Test course creation via API
    const createResponse = await page.request.post('http://localhost:4000/courses', {
      data: {
        title: 'E2E Test Course',
        description: 'A course created during end-to-end testing',
        ownerId: 'e2e-test-user'
      }
    });
    
    expect(createResponse.status()).toBe(201);
    const courseData = await createResponse.json();
    expect(courseData).toHaveProperty('id');
    expect(courseData).toHaveProperty('title', 'E2E Test Course');
    expect(courseData).toHaveProperty('slug');
    
    // Test course listing via API
    const listResponse = await page.request.get(`http://localhost:4000/courses?ownerId=e2e-test-user`);
    expect(listResponse.status()).toBe(200);
    
    const courses = await listResponse.json();
    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThanOrEqual(1);
    
    // Verify our created course is in the list
    const createdCourse = courses.find((course: any) => course.id === courseData.id);
    expect(createdCourse).toBeDefined();
    expect(createdCourse.title).toBe('E2E Test Course');
  });

  test('should validate error handling', async ({ page }) => {
    // Test invalid course creation
    const invalidResponse = await page.request.post('http://localhost:4000/courses', {
      data: {
        // Missing required fields
        description: 'Missing title and ownerId'
      }
    });
    
    expect(invalidResponse.status()).toBe(400);
    
    // Test 404 for non-existent endpoints
    const notFoundResponse = await page.request.get('http://localhost:4000/nonexistent');
    expect(notFoundResponse.status()).toBe(404);
  });
});
