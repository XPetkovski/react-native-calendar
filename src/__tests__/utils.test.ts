import {
  isValidPassword,
  formatTimeInput,
  isTimeValid,
} from '../utils/utils.ts';

describe('Utility Functions', () => {
  describe('isValidPassword', () => {
    it('returns true for a password with 8+ chars, upper, lower, and number', () => {
      // This is the one that failed before! Now it correctly expects `true`.
      expect(isValidPassword('SuperSecret123')).toBe(true);
    });

    it('returns false if missing a number', () => {
      expect(isValidPassword('SuperSecret')).toBe(false);
    });

    it('returns false if missing an uppercase letter', () => {
      expect(isValidPassword('supersecret123')).toBe(false);
    });

    it('returns false if it is too short', () => {
      expect(isValidPassword('Secr1')).toBe(false); // Only 5 characters
    });
  });

  describe('formatTimeInput', () => {
    it('automatically inserts a colon after two digits', () => {
      expect(formatTimeInput('1430')).toBe('14:30');
    });

    it('strips out letters and special characters', () => {
      expect(formatTimeInput('1a4:b3!0')).toBe('14:30');
    });
  });

  describe('isTimeValid', () => {
    it('returns true for valid 24-hour times', () => {
      expect(isTimeValid('09:30')).toBe(true);
      expect(isTimeValid('23:59')).toBe(true);
    });

    it('returns false for invalid times', () => {
      expect(isTimeValid('25:00')).toBe(false); // Invalid hour
      expect(isTimeValid('12:60')).toBe(false); // Invalid minute
    });
  });
});
