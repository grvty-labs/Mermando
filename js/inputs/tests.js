// @flow

type Value = ?string | ?number;
type Return = string | void;

export const required = (value: Value): Return => (
  value
    ? undefined
    : 'Required'
);
export const maxLength = (max: number) => (value: Value): Return => (
  value && value.length > max
    ? `Must be ${max} characters or less`
    : undefined
);
export const minLength = (min: number) => (value: Value): Return => (
  value && value.length < min
    ? `Must be ${min} characters or more`
    : undefined
);
export const number = (value: Value): Return => (
  value && isNaN(Number(value))
    ? 'Must be a number'
    : undefined
);
export const minValue = (min: number) => (value: Value): Return => (
  value && value < min
    ? `Must be at least ${min}`
    : undefined
);
export const email = (value: string): Return => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined);

export const alphaNumeric = (value: Value): Return => (
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined
);
export const phoneNumber = (value: number): Return => (
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined
);
