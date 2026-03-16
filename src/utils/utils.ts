export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // regex to check if at least one lowercase, one uppercase, one number is present
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  return strongPasswordRegex.test(password);
};

export const formatTimeInput = (text: string): string => {
  const cleaned = text.replace(/[^0-9]/g, '').substring(0, 4);
  if (cleaned.length > 2) {
    return `${cleaned.substring(0, 2)}:${cleaned.substring(2)}`;
  }

  return cleaned;
};

export const isTimeValid = (time: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
};