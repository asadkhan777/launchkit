import { SDKError } from './schemas.js';

export class SDKException extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'SDKException';
    this.code = code;
    this.details = details;
  }

  toJSON(): SDKError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

export function handlePrismaError(error: unknown): never {
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; message: string };
    
    switch (prismaError.code) {
      case 'P2002':
        throw new SDKException(
          'UNIQUE_CONSTRAINT_VIOLATION',
          'A record with this data already exists',
          prismaError
        );
      case 'P2025':
        throw new SDKException(
          'RECORD_NOT_FOUND',
          'The requested record was not found',
          prismaError
        );
      default:
        throw new SDKException(
          'DATABASE_ERROR',
          'An unexpected database error occurred',
          prismaError
        );
    }
  }

  throw new SDKException(
    'UNKNOWN_ERROR',
    error instanceof Error ? error.message : 'An unknown error occurred',
    error
  );
}
