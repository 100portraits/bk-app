export interface PhoneValidationResult {
  valid: boolean;
  cleaned: string;
  error?: string;
}

export function validatePhone(phone: string): PhoneValidationResult {
  // Strip spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Check if empty
  if (!cleaned) {
    return { valid: false, cleaned, error: 'Phone number is required' };
  }

  // Check if numeric (allow + at start for international)
  if (!/^\+?\d+$/.test(cleaned)) {
    return { valid: false, cleaned, error: 'Phone must contain only numbers' };
  }

  // Check minimum 9 digits
  const digitsOnly = cleaned.replace(/\D/g, '');
  if (digitsOnly.length < 9) {
    return { valid: false, cleaned, error: 'Phone must have at least 9 digits' };
  }

  return { valid: true, cleaned };
}
