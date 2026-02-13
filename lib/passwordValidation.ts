const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;

const hasLowercase = /[a-z]/;
const hasUppercase = /[A-Z]/;
const hasNumber = /\d/;
const hasSymbol = /[^A-Za-z0-9]/;
const hasWhitespace = /\s/;

export type PasswordValidationResult = {
  valid: boolean;
  errors: string[];
};

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`At least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    errors.push(`No more than ${MAX_PASSWORD_LENGTH} characters.`);
  }

  if (hasWhitespace.test(password)) {
    errors.push("No spaces.");
  }

  if (!hasLowercase.test(password)) {
    errors.push("One lowercase letter.");
  }

  if (!hasUppercase.test(password)) {
    errors.push("One uppercase letter.");
  }

  if (!hasNumber.test(password)) {
    errors.push("One number.");
  }

  if (!hasSymbol.test(password)) {
    errors.push("One symbol.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const passwordRequirements = [
  `At least ${MIN_PASSWORD_LENGTH} characters`,
  "At most 128 characters",
  "One uppercase letter",
  "One lowercase letter",
  "One number",
  "One symbol",
  "No spaces",
];

export const getPasswordChecks = (password: string) => [
  {
    label: `At least ${MIN_PASSWORD_LENGTH} characters`,
    passed: password.length >= MIN_PASSWORD_LENGTH,
  },
  {
    label: "At most 128 characters",
    passed: password.length <= MAX_PASSWORD_LENGTH,
  },
  {
    label: "One uppercase letter",
    passed: hasUppercase.test(password),
  },
  {
    label: "One lowercase letter",
    passed: hasLowercase.test(password),
  },
  {
    label: "One number",
    passed: hasNumber.test(password),
  },
  {
    label: "One symbol",
    passed: hasSymbol.test(password),
  },
  {
    label: "No spaces",
    passed: !hasWhitespace.test(password),
  },
];
