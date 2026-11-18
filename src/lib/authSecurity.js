/**
 * EstateOne Authentication Security Configuration & Utilities
 * Enforces PRD Acceptance Rules:
 * 1. Password security requirements (8+ chars, upper, lower, number, special char).
 * 2. Sensitive error masking (account enumeration prevention).
 * 3. OTP expiration & resend limits.
 * 4. Graceful session lifecycle management.
 */

export const PASSWORD_REQUIREMENTS = [
  { id: 'minLength', label: 'At least 8 characters', regex: /.{8,}/ },
  { id: 'hasUpper', label: 'At least one uppercase letter (A-Z)', regex: /[A-Z]/ },
  { id: 'hasLower', label: 'At least one lowercase letter (a-z)', regex: /[a-z]/ },
  { id: 'hasNumber', label: 'At least one number (0-9)', regex: /[0-9]/ },
  { id: 'hasSpecial', label: 'At least one special character (!@#$%^&*)', regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/ }
];

export const AUTH_SECURITY_CONFIG = {
  OTP_RESEND_COOLDOWN_SECONDS: 60,
  OTP_MAX_RESEND_ATTEMPTS: 3,
  OTP_EXPIRATION_MS: 5 * 60 * 1000, // 5 minutes
  SESSION_DURATION_MS: 2 * 60 * 60 * 1000, // 2 hours
  DEMO_OTP: '123456'
};

export const MASKED_AUTH_MESSAGES = {
  // Never reveal whether an email exists or if only the password was wrong
  INVALID_CREDENTIALS: 'Invalid email, mobile number, or password. Please verify your credentials and try again.',
  ACCOUNT_RESET_DISPATCHED: 'If an account is associated with this email or mobile number, a 6 digit verification code has been dispatched.',
  OTP_INVALID: 'The verification code entered is invalid. Please check the code and try again.',
  OTP_EXPIRED: 'This verification code has expired. Please request a new code to continue.',
  OTP_MAX_RESENDS: 'Maximum resend attempts reached (3 of 3). For security, please wait 15 minutes before requesting a new code.',
  SESSION_EXPIRED: 'Your session has expired due to inactivity. Please sign in again to continue.'
};

/**
 * Validates password against all 5 configured security criteria.
 */
export function checkPasswordSecurity(password = '') {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const criteriaMet = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  let strength = 'weak';
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-rose-500';

  if (criteriaMet === 5) {
    strength = 'strong';
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
  } else if (criteriaMet >= 3) {
    strength = 'medium';
    strengthLabel = 'Medium';
    strengthColor = 'bg-amber-500';
  }

  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    criteriaMet,
    totalCriteria: 5,
    isValid: criteriaMet === 5,
    strength,
    strengthLabel,
    strengthColor
  };
}
