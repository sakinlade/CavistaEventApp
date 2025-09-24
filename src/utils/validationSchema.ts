import * as Yup from 'yup';

export const registrationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions'),
});

export const EmployeeSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export const EventSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Event name must be at least 2 characters')
    .required('Event name is required'),
  message: Yup.string()
    .min(24, 'Event message must be at least 24 characters')
    .required('Event message is required'),
});

export const ChangeRoleSchema = Yup.object().shape({
  role: Yup.string()
    .min(2, 'Role name must be at least 2 characters')
    .required('Role name is required'),
});

export const EmployeeEventSchema = Yup.object().shape({
  eventId: Yup.string().required('Event ID is required'),
  employeeId: Yup.string()
    .required('Employee ID is required'),
  eventDate: Yup.date()
    .required('Event date is required'),
});
