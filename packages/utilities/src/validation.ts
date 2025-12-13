/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

/**
 * Predefined validation error messages and helper generators
 */
export const errors = {
  isEmpty: 'Please fill out this field',
  isShort: (length: number) => `At least ${length} characters`,
  isLong: (length: number) => `At most ${length} characters`,
  isMatch: (field: string) => `${field}'s must match`,
  isInvalid: (field: string) => `Invalid ${field} format`,
  isPassword: 'Must include an uppercase, lowercase, number, and symbol',
  isText: 'Exclude numbers here',
  isUnchecked: 'Check this box to continue',
  isInauthentic: (field: string) => `Incorrect ${field}`,
};

/**
 * ---------------------------------
 * Base reusable validators
 * ---------------------------------
 *
 * Example usage for a form field
 *
 * const usernameError = validators.required(username) ||
 *                       validators.minLength(username, 3) ||
 *                       validators.maxLength(username, 20) ||
 *                       validators.textOnly(username);
 *
 * const passwordError = validators.password(password);
 *
 * const confirmError = validators.matches(confirmPassword, password, 'Password');
 */
export const validators = {
  /**
   * Check if the field is empty
   */
  required: (val: string): string | false =>
    !val.trim() ? errors.isEmpty : false,

  /**
   * Minimum length validator
   */
  minLength: (val: string, length: number): string | false =>
    val.length < length ? errors.isShort(length) : false,

  /**
   * Maximum length validator
   */
  maxLength: (val: string, length: number): string | false =>
    val.length > length ? errors.isLong(length) : false,

  /**
   * Email validator
   */
  email: (val: string): string | false =>
    !/^\S+@\S+\.\S+$/.test(val.trim()) ? errors.isInvalid('email') : false,

  /**
   * Password validator
   * Must include uppercase, lowercase, number, and symbol
   */
  password: (val: string): string | false =>
    !(
      /[A-Z]/.test(val) &&
      /[a-z]/.test(val) &&
      /[0-9]/.test(val) &&
      /[$&+,:;=?@#|'<>.^*()%!-]/.test(val)
    )
      ? errors.isPassword
      : false,

  /**
   * Text-only validator (no numbers)
   */
  textOnly: (val: string): string | false =>
    /[0-9]/.test(val) ? errors.isText : false,

  /**
   * Checkbox validator
   */
  checked: (val: boolean): string | false => (val ? false : errors.isUnchecked),

  /**
   * Match validator for comparing two fields
   */
  matches: (
    val: string,
    otherVal: string,
    fieldName = 'Field'
  ): string | false => (val !== otherVal ? errors.isMatch(fieldName) : false),

  /**
   * Generic regex validator with custom error
   */
  pattern: (val: string, re: RegExp, errorMsg: string): string | false =>
    !re.test(val) ? errorMsg : false,
};

/**
 * Evaluate password strength based on length and custom requirements.
 *
 * @param password - string to evaluate
 * @param requirements - array of regex/label pairs to check against
 * @returns strength score between 10 and 100
 */
export const getPasswordStrength = (
  password: string,
  requirements: { re: RegExp; label: string }[]
): number => {
  let multiplier = password.length >= 8 ? 0 : 1;

  requirements.forEach((req) => {
    if (!req.re.test(password)) multiplier += 1;
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
};
