import * as z from 'zod';

export type SignUpFormValues = z.infer<typeof signUpSchema>;

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .refine((value) => /^[a-zA-Z\s]+$/.test(value), {
        message: 'Name must contain only letters and spaces',
      }),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .refine((value) => !value.endsWith('@test.com'), {
        message: 'Temporary domains are not allowed',
      }),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password is too long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^a-zA-Z0-9]/,
        'Password must contain at least one special character'
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default signUpSchema;
