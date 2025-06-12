import * as Yup from 'yup';
export const registerSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Invalid email')
    .required('Email is required'),
  username: Yup.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .required('Username required'),
  newPassword: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
      'Use uppercase, lowercase, number & symbol'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});
