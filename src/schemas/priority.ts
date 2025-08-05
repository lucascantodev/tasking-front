import { z } from 'zod';

const priorityEnum = z.enum(['low', 'medium', 'high'], {
  required_error: 'Priority is required.',
  invalid_type_error: 'Priority must be one of: low, medium, high.',
});

export type Priority = z.infer<typeof priorityEnum>;
export default priorityEnum;
