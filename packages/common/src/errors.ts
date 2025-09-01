/**
 * Standardized error types for LaunchKit AI
 * Provides consistent error handling across all packages
 */

/**
 * Base error interface with correlation support
 */
export interface BaseError {
  readonly code: string;
  readonly message: string;
  readonly correlationId?: string;
  readonly timestamp: Date;
  readonly context?: Record<string, unknown>;
}

/**
 * Domain-specific error categories
 */
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  DATABASE = 'DATABASE',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  RATE_LIMITING = 'RATE_LIMITING',
  NETWORK = 'NETWORK',
  SYSTEM = 'SYSTEM',
}

/**
 * Specific error codes with consistent naming
 */
export enum ErrorCode {
  // Validation errors
  INVALID_INPUT = 'VALIDATION_INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'VALIDATION_MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT',

  // Business logic errors
  COURSE_NOT_FOUND = 'BUSINESS_COURSE_NOT_FOUND',
  COURSE_ALREADY_EXISTS = 'BUSINESS_COURSE_ALREADY_EXISTS',
  USER_NOT_FOUND = 'BUSINESS_USER_NOT_FOUND',
  INSUFFICIENT_PERMISSIONS = 'BUSINESS_INSUFFICIENT_PERMISSIONS',

  // External service errors
  STRIPE_ERROR = 'EXTERNAL_STRIPE_ERROR',
  AI_SERVICE_ERROR = 'EXTERNAL_AI_SERVICE_ERROR',
  EMAIL_SERVICE_ERROR = 'EXTERNAL_EMAIL_SERVICE_ERROR',

  // Database errors
  CONNECTION_FAILED = 'DATABASE_CONNECTION_FAILED',
  QUERY_FAILED = 'DATABASE_QUERY_FAILED',
  CONSTRAINT_VIOLATION = 'DATABASE_CONSTRAINT_VIOLATION',

  // Authentication/Authorization
  INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  FORBIDDEN = 'AUTH_FORBIDDEN',

  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Network errors
  TIMEOUT = 'NETWORK_TIMEOUT',
  CONNECTION_ERROR = 'NETWORK_CONNECTION_ERROR',

  // System errors
  INTERNAL_ERROR = 'SYSTEM_INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SYSTEM_SERVICE_UNAVAILABLE',
}

/**
 * LaunchKit AI standardized error class
 */
export class LaunchKitError extends Error implements BaseError {
  readonly code: string;
  readonly category: ErrorCategory;
  readonly correlationId: string;
  readonly timestamp: Date;
  readonly context: Record<string, unknown>;
  readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    options: {
      category?: ErrorCategory;
      correlationId?: string;
      context?: Record<string, unknown>;
      cause?: Error;
      isOperational?: boolean;
    } = {}
  ) {
    super(message, { cause: options.cause });

    this.name = 'LaunchKitError';
    this.code = code;
    this.category = options.category || this.inferCategory(code);
    this.correlationId = options.correlationId || this.generateCorrelationId();
    this.timestamp = new Date();
    this.context = options.context || {};
    this.isOperational = options.isOperational ?? true;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LaunchKitError);
    }
  }

  private inferCategory(code: ErrorCode): ErrorCategory {
    if (code.startsWith('VALIDATION_')) return ErrorCategory.VALIDATION;
    if (code.startsWith('BUSINESS_')) return ErrorCategory.BUSINESS_LOGIC;
    if (code.startsWith('EXTERNAL_')) return ErrorCategory.EXTERNAL_SERVICE;
    if (code.startsWith('DATABASE_')) return ErrorCategory.DATABASE;
    if (code.startsWith('AUTH_')) return ErrorCategory.AUTHENTICATION;
    if (code.startsWith('RATE_LIMIT_')) return ErrorCategory.RATE_LIMITING;
    if (code.startsWith('NETWORK_')) return ErrorCategory.NETWORK;
    return ErrorCategory.SYSTEM;
  }

  private generateCorrelationId(): string {
    return `lk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Convert error to structured object for logging/API responses
   */
  toJSON(): BaseError {
    return {
      code: this.code,
      message: this.message,
      correlationId: this.correlationId,
      timestamp: this.timestamp,
      context: this.context,
    };
  }

  /**
   * Convert error to API response format
   */
  toAPIResponse() {
    return {
      error: {
        code: this.code,
        message: this.message,
        correlationId: this.correlationId,
        timestamp: this.timestamp.toISOString(),
      },
    };
  }
}

/**
 * Result type for error handling without exceptions
 */
export type Result<T, E = LaunchKitError> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Utility functions for Result type
 */
export const ResultUtils = {
  /**
   * Create a success result
   */
  success<T>(data: T): Result<T, never> {
    return { success: true, data };
  },

  /**
   * Create an error result
   */
  error<E>(error: E): Result<never, E> {
    return { success: false, error };
  },

  /**
   * Create error result from LaunchKitError
   */
  fromError(error: LaunchKitError): Result<never, LaunchKitError> {
    return { success: false, error };
  },

  /**
   * Wrap a function that might throw into a Result
   */
  async fromPromise<T>(
    promise: Promise<T>,
    mapError?: (error: unknown) => LaunchKitError
  ): Promise<Result<T, LaunchKitError>> {
    try {
      const data = await promise;
      return ResultUtils.success(data);
    } catch (error) {
      const mappedError = mapError
        ? mapError(error)
        : new LaunchKitError(
            ErrorCode.INTERNAL_ERROR,
            error instanceof Error ? error.message : 'Unknown error',
            { cause: error instanceof Error ? error : undefined }
          );
      return ResultUtils.error(mappedError);
    }
  },

  /**
   * Check if result is success
   */
  isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
    return result.success;
  },

  /**
   * Check if result is error
   */
  isError<T, E>(result: Result<T, E>): result is { success: false; error: E } {
    return !result.success;
  },

  /**
   * Map success value to new type
   */
  map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
    return result.success ? ResultUtils.success(fn(result.data)) : result;
  },

  /**
   * Chain multiple operations that return Results
   */
  chain<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => Result<U, E>
  ): Result<U, E> {
    return result.success ? fn(result.data) : result;
  },
};

/**
 * HTTP status code mapping for API responses
 */
export function getHTTPStatusFromError(error: LaunchKitError): number {
  switch (error.category) {
    case ErrorCategory.VALIDATION:
      return 400; // Bad Request
    case ErrorCategory.AUTHENTICATION:
      if (error.code === ErrorCode.UNAUTHORIZED) return 401;
      if (error.code === ErrorCode.FORBIDDEN) return 403;
      return 401; // Unauthorized
    case ErrorCategory.AUTHORIZATION:
      return 403; // Forbidden
    case ErrorCategory.BUSINESS_LOGIC:
      if (error.code.includes('NOT_FOUND')) return 404;
      return 422; // Unprocessable Entity
    case ErrorCategory.RATE_LIMITING:
      return 429; // Too Many Requests
    case ErrorCategory.EXTERNAL_SERVICE:
    case ErrorCategory.DATABASE:
    case ErrorCategory.NETWORK:
    case ErrorCategory.SYSTEM:
      return 500; // Internal Server Error
    default:
      return 500;
  }
}

/**
 * Context helpers for correlation tracking
 */
export class ErrorContext {
  private static correlationId: string | null = null;

  /**
   * Set correlation ID for current context
   */
  static setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  /**
   * Get current correlation ID
   */
  static getCorrelationId(): string | null {
    return this.correlationId;
  }

  /**
   * Clear correlation ID
   */
  static clear(): void {
    this.correlationId = null;
  }

  /**
   * Run function with correlation ID context
   */
  static async withCorrelationId<T>(
    id: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const previousId = this.correlationId;
    this.setCorrelationId(id);
    try {
      return await fn();
    } finally {
      this.correlationId = previousId;
    }
  }
}
