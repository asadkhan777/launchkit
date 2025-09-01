import { describe, it, expect } from 'vitest';

describe('API Performance', () => {
  it('should respond within 200ms', async () => {
    const start = globalThis.performance.now();
    const response = await fetch('http://localhost:3000/courses');
    const end = globalThis.performance.now();

    expect(response.status).toBe(200);
    expect(end - start).toBeLessThan(200);
  });
});
