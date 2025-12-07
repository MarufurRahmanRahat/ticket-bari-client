export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};