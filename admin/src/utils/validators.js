import { PASSWORD_MIN_LENGTH } from './constants';

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
export const isValidPassword = (pw) => typeof pw === 'string' && pw.length >= PASSWORD_MIN_LENGTH;
export const passwordsMatch = (a, b) => a === b;
export const isValidOtp = (otp) => /^\d{6}$/.test(otp || '');
export const isDigitsOnly = (value) => /^\d*$/.test(value || '');
