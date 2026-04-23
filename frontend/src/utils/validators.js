import { PASSWORD_MIN_LENGTH, ALLOWED_IMAGE_TYPES, IMAGE_MAX_SIZE_BYTES } from './constants';

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');

export const isValidPassword = (password) => typeof password === 'string' && password.length >= PASSWORD_MIN_LENGTH;

export const passwordsMatch = (a, b) => a === b;

export const isValidOtp = (otp) => /^\d{6}$/.test(otp || '');

export const isDigitsOnly = (value) => /^\d*$/.test(value || '');

export const validateImageFile = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only images are allowed.' };
  }
  if (file.size > IMAGE_MAX_SIZE_BYTES) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }
  return { valid: true };
};
