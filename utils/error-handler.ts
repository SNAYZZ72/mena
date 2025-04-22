import { PostgrestError } from '@supabase/supabase-js';

/**
 * Represents a standardized error response
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: string;
}

/**
 * Error handler for client-side errors 
 * @param error The error object to handle
 * @returns A standardized error response
 */
export function handleError(error: unknown): ErrorResponse {
  // Handle Supabase errors
  if (isPostgrestError(error)) {
    return {
      message: error.message || 'Database error occurred',
      code: error.code,
      details: error.details
    };
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message || 'An error occurred',
      details: error.stack
    };
  }
  
  // Handle errors that might be strings
  if (typeof error === 'string') {
    return {
      message: error
    };
  }
  
  // Default fallback for unknown error types
  return {
    message: 'An unknown error occurred'
  };
}

/**
 * Type guard for Supabase PostgrestError
 */
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' && 
    error !== null && 
    'message' in error &&
    'code' in error
  );
}

/**
 * Formats error messages for display to users
 * @param error Error to format for user display
 * @returns User-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const { message, code } = handleError(error);
  
  // Common Supabase error codes with user-friendly messages
  if (code === '23505') {
    return 'This item already exists.';
  }
  
  if (code === 'P0001') {
    return 'Unable to perform this action due to a policy restriction.';
  }
  
  if (message.includes('duplicate key') || message.includes('already exists')) {
    return 'This email is already in use. Please try another one.';
  }
  
  if (message.includes('invalid login') || message.includes('Invalid login')) {
    return 'Invalid email or password. Please try again.';
  }
  
  if (message.includes('password')) {
    return 'Password must be at least 6 characters.';
  }
  
  // Default message for other errors
  return message || 'Something went wrong. Please try again later.';
} 