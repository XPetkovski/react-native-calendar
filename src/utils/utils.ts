// src/utils/validation.ts

/**
 * Checks if the provided string is a valid email format.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if the password meets minimum security requirements.
 * (Currently set to 6 characters based on Firebase defaults).
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};
