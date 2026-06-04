const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AUTH_RULES = {
  username: 'Username must be 2-60 characters.',
  email: 'Email must be valid and 254 characters or less.',
  password: 'Password must be 8-128 characters.'
};

function validateEmail(email) {
  if (!email) return 'Email is required';
  if (email.length > 254) return 'Email must be 254 characters or less';
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address';
  return null;
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 128) return 'Password must be 128 characters or less';
  return null;
}

export function validateRegisterInput({ username, email, password }) {
  const values = {
    username: username.trim(),
    email: email.trim(),
    password
  };

  if (!values.username) return { message: 'Username is required' };
  if (values.username.length < 2) return { message: 'Username must be at least 2 characters' };
  if (values.username.length > 60) return { message: 'Username must be 60 characters or less' };

  const emailError = validateEmail(values.email);
  if (emailError) return { message: emailError };

  const passwordError = validatePassword(values.password);
  if (passwordError) return { message: passwordError };

  return { values };
}

export function validateLoginInput({ email, password }) {
  const values = {
    email: email.trim(),
    password
  };

  const emailError = validateEmail(values.email);
  if (emailError) return { message: emailError };

  const passwordError = validatePassword(values.password);
  if (passwordError) return { message: passwordError };

  return { values };
}
