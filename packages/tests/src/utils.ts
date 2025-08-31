// Test utilities
export function createTestUser(email: string = 'test@example.com') {
  return {
    email,
    id: `test-user-${Date.now()}`,
    createdAt: new Date(),
  };
}
