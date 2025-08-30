import { describe, it, expect } from 'vitest';
import { sum } from '../packages/common/src/sum.js';

describe('Sample Test Suite', () => {
  it('should pass basic assertion', () => {
    expect(true).toBe(true);
  });

  it('should verify environment setup', () => {
    expect(typeof process).toBe('object');
    expect(process.env).toBeDefined();
  });
});

describe('Sum Function Integration Test', () => {
  it('should correctly add two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should handle negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });

  it('should handle zero', () => {
    expect(sum(0, 0)).toBe(0);
    expect(sum(5, 0)).toBe(5);
  });

  it('should handle decimal numbers', () => {
    expect(sum(1.5, 2.5)).toBe(4);
  });
});
