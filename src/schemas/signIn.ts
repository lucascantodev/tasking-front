import { z } from 'zod';

export type SignUpFormValues = z.infer<typeof signInSchema>;

const signInSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Please enter a valid email',
    })
    .email('Email must be a valid email address')
    .toLowerCase()
    .email({ message: 'Invalid email format' })
    .trim()
    .min(5, { message: 'Email must be at least 5 characters' })
    .max(250, { message: 'Email must not exceed 250 characters' }),

  password: z
    .string({
      required_error: 'Password is required',
    })
    .max(250, 'Password must not exceed 20 characters')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});
