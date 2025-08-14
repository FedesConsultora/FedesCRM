// Normaliza nombres: " juan  pérez " -> "Juan Pérez"
export const normalizeName = (str = '') =>
  String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

export const emailRegex = /^\S+@\S+\.\S+$/;

export const getPasswordValidations = (pwd = '') => ({
  length: pwd.length >= 8,
  upper: /[A-Z]/.test(pwd),
  lower: /[a-z]/.test(pwd),
  number: /\d/.test(pwd),
  special: /[!@#$%^&*]/.test(pwd),
});

export const allPasswordValid = (pwd = '') => {
  const checks = getPasswordValidations(pwd);
  return Object.values(checks).every(Boolean);
};
